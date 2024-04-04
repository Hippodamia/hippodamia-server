import { Horse, Race } from "@hippodamia/core";

export interface RandomEvent {
    name: string; //唯一name使用系列.xxx来确定
    alias: string;//别名，用于中文的表示
    type: RandomEventType;
    desc: string,//简化的描述
    handler: (race: Race, horse: Horse) => void
}

export enum RandomEventType {
    Positive,
    Negative,
    Neutral,
}
