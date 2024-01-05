import {EventEmitter} from "eventemitter3";
import {HipEmitterType} from "./types";




/*
* 可触发事件表
* 2023.9.26 以此为准
* onRaceStart 比赛开始
* onRoundStart 回合开始
* onRoundEnd 回合结束
* onHorseRoundStart 开始计算选手回合
* onHorseRoundEnd 结束计算选手回合
* */
export class HipComponent extends EventEmitter<HipEmitterType>{

}
