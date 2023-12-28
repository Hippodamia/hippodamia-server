import {Track} from "./Track";
import {RaceLog, UserInfo} from "./types";
import {Horse} from "./Horse";
import {shuffle} from "./utils";
import {HipComponent} from "./HipComponent";

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

    constructor(config: RaceConfig) {
        this.config = config;
    }

    onRaceStart() {
    }

    onRaceRoundStart() {
        this.components.forEach(x => x.emit("onRoundStart", this))
    }

    onRaceRoundEnd() {
        this.components.forEach(x => x.emit("onRoundEnd", this))
    }

    start() {
        this.isStarted = true;
        //打乱players数组，并为每一个player构建track
        for (const player of shuffle(this.players)) {
            let track: Track;
            this.tracks.push(track = new Track())
            track.horses = [new Horse(player, player.display, this.config.speed)]
        }
    }

    next() {
        this.logs = [];
        this.onRaceRoundStart();
        for (let track of this.tracks) {
            track.next(this);
        }

        this.onRaceRoundEnd();
        this.round++;

        this.tracks.forEach(track => track.horses.forEach(horse => {
            if (horse.step > track.segments.length)
                horse.step = track.segments.length;
        }))

        if (this.tracks.findIndex(track => track.horses.findIndex(horse => horse.step >= track.segments.length))) {
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
            content,
            round: this.round
        })
    }

    getRaceResult() {
        return {
            winners: this.getHorses().find(x => x.track && x.step >= x.track?.segments.length)
        }
    }

    join(user: UserInfo, display: string) {
        //将用户信息构造为player信息，并在start后进行初始化
        if (this.players.find(x => x.id == user.id)) {
            return false;
        }
        this.players.push({...user, display})
        return true;
    }
}

export {Race};
