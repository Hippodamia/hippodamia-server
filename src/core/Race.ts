import {Track} from "./Track";
import {RaceLog, UserInfo} from "./types";
import {Horse} from "./Horse";
import {shuffle} from "./utils";
import {HipComponent} from "./HipEventEmitter";
import {FortuityDay} from "./components/FortuityDay";

export interface RaceConfig {
    /**
     * 初始速度
     */
    speed: number
}

class Race {

    tracks: Track[] = [];
    round: number = 0;
    components: HipComponent[] = [];
    logs: RaceLog[] = []
    players: (UserInfo & { display: string })[] = []

    ended: boolean = false

    mode: 'pure' | 'random' | 'contract' = 'pure'

    config: RaceConfig;

    public isStarted: boolean = false;

    constructor(config: RaceConfig,mode: 'pure' | 'random' | 'contract' = 'pure') {
        this.config = config;
        this.mode = mode;
        if(this.mode=='random'){
           this.components.push(new FortuityDay())
        }
    }

    onRaceStart() {
    }

    private onRaceRoundStart() {
        this.components.forEach(x => x.emit("round.end", this))
    }

    private onRaceRoundEnd() {
        this.components.forEach(x => x.emit('round.end', this))
    }
    /**
     * Joins a user to the game.
     *
     * @param user - The user information.
     * @param display - The display name for the user.
     * @return Returns true if the user is successfully joined, false otherwise.
     */
    public join(user: UserInfo, display: string) {
        //将用户信息构造为player信息，并在start后进行初始化
        if (this.players.find(x => x.id == user.id)) {
            return false;
        }
        this.players.push({...user, display})
        return true;
    }

    public start() {
        this.isStarted = true;
        //打乱players数组，并为每一个player构建track
        for (const player of shuffle(this.players)) {
            let track: Track;
            this.tracks.push(track = new Track())

            let horse = new Horse(player, player.display)
            horse.track=track;
            track.horses = [horse]

            //todo 允许赛场自定义基础速度与其他基础属性
        }
    }

    public next() {
        this.logs = [];

        //赛场回合逻辑
        this.onRaceRoundStart();
        for (let track of this.tracks) {
            track.next(this);
        }
        this.onRaceRoundEnd();
        this.round++;

        //检查超出
        this.tracks.forEach(track => track.horses.forEach(horse => {
            if (horse.step > track.segments.length)
                horse.step = track.segments.length;
        }))

        //检查winner
        if (this.tracks.findIndex(track => track.horses.findIndex(horse => horse.step >= track.segments.length)>=0)>=0) {
            //win
            this.ended = true;
            console.log('WINNER WINNER CHICKEN DINNER!')
        }

    }

    getHorses() {
        let horses: Horse[] = []
        this.tracks.forEach(t => {
            horses.push(...t.horses)
        })
        return horses;
    }

    pushLog(horse: Horse, content: string) {
        this.logs.push({
            player: horse.display,
            content: content.replace('%player%', horse.display),
            round: this.round
        })
    }

    getRaceResult() {
        return {
            winners: this.getHorses().find(x => x.track && x.step >= x.track?.segments.length)
        }
    }


}

export {Race};
