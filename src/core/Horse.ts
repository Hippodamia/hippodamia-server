import {BuffContainer} from "./BuffContainer";
import {Track} from "./Track";
import {HorseStatus, UserInfo} from "./types";
import {Race} from "./Race";

interface HorseProperty {
    speed: number // 0-20的数值
    effect_resistance: number //1为单位的增长概率的倍率
    luck: number // 1为单位，用于增加幸运概率的倍率
    status: HorseStatus,
    display: string

}

export class Horse {
    constructor(user: UserInfo, display: string) {
        this.user = user;
        this.step = 1;
        this.buffContainer = new BuffContainer<Horse, HorseProperty>();
        this._property = {
            speed: 10,
            effect_resistance: 0,
            luck: 1,
            status: HorseStatus.NORMAL,
            display: display
        }
    }

    track?: Track;
    user: UserInfo;
    buffContainer: BuffContainer<Horse, HorseProperty>;
    step: number;

    public last_moved: number;

    private _property: HorseProperty;


    get Property(): HorseProperty {
        let property = this._property;
        return this.buffContainer.getModified(property)
    }

    set Property(value: HorseProperty) {
        this._property = value
    }

    //todo 让property能够被直接更改子值

    public onHorseRoundStart(race: Race, track: Track) {

        this.buffContainer.emit('horse.round.start')

        race.components.forEach(x => x.emit("horse.round.start", race, this))
    }

    public onHorseRoundEnd(race: Race, track: Track) {
        this.buffContainer.emit('horse.round.end')

        race.components.forEach(x => x.emit("horse.round.end", race, this))

        //刷新冷却回合
        this.buffContainer.refresh(race,this);
    }

    /**
     * Executes a move for the horse character, taking into account any active buffs.
     * @return 距离上一次移动的步数
     */
    public next(race: Race, track: Track) {
        let step = this.step;
        this.onHorseRoundStart(race, track);

        //概率获得随机事件

        this.move(this.getRandomSteps())

        this.onHorseRoundEnd(race, track);

        this.last_moved = this.step - step;

        return this.last_moved;
    }

    public move(step: number) {
        let move = step;
        if (this.Property.status == HorseStatus.NORMAL) {
            //计算buff是否导致无法移动
            let canMove = true;
            //canMove = this.buffs.call<boolean, any>("canMove", true, this, {race, horse: this, track});
            if (canMove) {
                //move = this.buffs.call<number, any>("onMove", move, this, {race, horse: this, track});
            }
        }
        this.step += move;
    }

    get display() {
        return this.Property.display
    }

    private getRandomSteps() {
        function sigmoid(x, k, a) {
            return 1 / (1 + Math.exp(-k * (x - a)));
        }

        const k = 0.2; // 调整函数的陡峭程度
        const a = 10; // 控制函数的中心位置
        const p = sigmoid(Math.min(this.Property.speed, 20), k, a);
        const randomNumber = Math.random();
        if (p < 0.2) {
            return 0;
        } else if (p > 0.8) {
            return 3;
        } else {
            return randomNumber < 0.5 ? 1 : 2;
        }
    }
}
