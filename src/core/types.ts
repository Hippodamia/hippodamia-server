import {Horse} from "./Horse";
import {Race} from "./Race";
import {BuffContainer} from "./BuffContainer";
import {EventEmitter} from "eventemitter3";
import {Track} from "./Track";
import {Segment} from "./Segment";

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
    priority?: number;//应为1-100优先级越大，越会在后面处理
}

type ValidKey = Exclude<string, keyof BuffBase>;

interface BuffListener {
    [key: ValidKey]: (target: any, param?: any) => any;
}

//时间列表
export type HipEmitterType = {
    'race.start': () => void,
    'round.start': (race: Race) => void,
    'round.end': (race: Race) => void,
    'horse.round.start':( race:Race,horse:Horse) => void,
    'horse.round.end':(race:Race,horse:Horse) => void,
    'horse.moved': (race:Race,moved:number) => void,
    'segment.round.start': (race: Race,segment:Segment) => void,
    'segment.round.end': (race: Race,segment:Segment) => void,
    'track.round.start': (race:Race ,track:Track) => void,
    'track.round.end': (race:Race ,track:Track) => void,
    [key: string]: (...args: any[]) => void,
}

type Buff<T> = BuffBase & { listener?: EventEmitter<HipEmitterType>, modifier?: (target: T,buff:BuffWithTime<T>) => T };
type BuffWithTime<T> = Buff<T> & { times: number, remains: number,stacks:number }


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


export type {UserInfo, Buff,BuffWithTime, RaceLifeCycle, RaceLog};
export {EffectType, HorseStatus,RaceEvent,RaceMode};
