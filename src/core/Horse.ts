import {BuffContainer} from "./BuffContainer";
import {Track} from "./Track";
import {HorseStatus, UserInfo} from "./types";
import {Race} from "./Race";

interface HorseProperty {
    speed: number // 0-20的数值
    effect_resistance: number //1为单位的增长概率的倍率
    luck: number // 1为单位，用于增加幸运概率的倍率
}

export class Horse {
    constructor(user: UserInfo, display: string, speed: number) {
        this.user = user;
        this.step = 1;
        this._speed = speed;
        this.display = display;
        this.buffs = new BuffContainer<Horse>();

        this._property = {
            speed: 10,
            effect_resistance: 0,
            luck: 1
        }
    }

    track?: Track;
    user: UserInfo;
    buffs: BuffContainer<Horse>;
    display: string;
    status: HorseStatus = HorseStatus.NORMAL;
    step: number;
    public last_moved: number;

    private _speed: number;

    private _property: HorseProperty;


    get speed() {
        let speed = this._speed;
        speed = this.buffs.call<number, { horse: Horse }>("speed", speed, this, {
            horse: this,
        });

        return speed;
    }

    set speed(value: number) {
        this._speed += value;
    }

    get Property(): HorseProperty {
        return this._property;
    }

    set Property(value: HorseProperty) {
        this._property = value
    }

    public onHorseRoundStart(race: Race, track: Track) {
        this.buffs.call<void, any>("onHorseRoundStart", undefined, this, {
            horse: this,
            race
        });

        race.components.forEach(x => x.emit("onHorseRoundStart", {race, horse: this, track}))
    }

    public onHorseRoundEnd(race: Race, track: Track) {
        this.buffs.call<void, any>("onHorseRoundEnd", undefined, this, {
            horse: this,
            race
        });
        race.components.forEach(x => x.emit("onHorseRoundEnd", {race, horse: this, track}))

        //buff timer
        this.buffs.refresh();
    }

    /**
     * Executes a move for the horse character, taking into account any active buffs.
     * @return 距离上一次移动的步数
     */
    next(race: Race, track: Track) {
        let step = this.step;
        this.onHorseRoundStart(race, track);
        let randomMove = 0;
        //概率获得随机事件
        //得到buff计算后的speed并计算这次的步数(speed的get本身就会经过buff计算)
        let speed = this.speed;
        let random = Math.floor(Math.random() * speed * 5) + speed * 4;
        if (random < 8.5) {
            randomMove = 0;
        } else if (random >= 80) {
            randomMove = 2;
        } else {
            randomMove = 1;
        }

        this.move(randomMove)

        this.onHorseRoundEnd(race, track);


        this.last_moved = this.step - step;

        return this.step - step;
    }

    move(step: number) {
        let move = step;
        if (this.status == HorseStatus.NORMAL) {
            //计算buff是否导致无法移动
            let canMove = true;
            //canMove = this.buffs.call<boolean, any>("canMove", true, this, {race, horse: this, track});
            if (canMove) {
                //move = this.buffs.call<number, any>("onMove", move, this, {race, horse: this, track});
            }
        }
        this.step += move;
    }

    private getRandomSteps() {
        function sigmoid(x, k, a) {
            return 1 / (1 + Math.exp(-k * (x - a)));
        }
        const k = 0.2; // 调整函数的陡峭程度
        const a = 10; // 控制函数的中心位置
        const p = sigmoid(this.Property.speed, k, a);
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
