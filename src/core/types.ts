import {Horse} from "./Horse";
import {Race} from "./Race";
import {BuffContainer} from "./BuffContainer";
import {EventEmitter} from "eventemitter3";

interface RaceLog {
    player: string,
    content: string,
    round: number
}

interface UserInfo {
    name?: string;
    id: string;
}

enum EffectType {
    Positive,
    Negative,
    Neutral,
}

enum HorseStatus {
    NORMAL = "normal",
    DEAD = "dead",
    LEFT = "left",
}

interface BuffBase {
    name: string;
    type: EffectType;
    desc: string,
    doc?: string,
    time: number;
}

type ValidKey = Exclude<string, keyof BuffBase>;

interface BuffListener {
    [key: ValidKey]: (target: any, param?: any) => any;
}

type Buff = BuffBase & { listener: EventEmitter }


interface RaceLifeCycle {
}

enum RaceEvent {
    RaceStart,
    RoundStart,
    Track,
    Segment,
    TrackEnd,
    RoundEnd,
    Move,
}

enum RaceMode{
    Pure='pure',
    RandomEvent='random',
    Contract = 'contract',
}


export type {UserInfo, Buff, RaceLifeCycle, RaceLog};
export {EffectType, HorseStatus,RaceEvent,RaceMode};
