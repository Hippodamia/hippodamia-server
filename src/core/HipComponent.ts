import {EventEmitter} from "eventemitter3";
import {Race} from "./Race";
import {Horse} from "./Horse";
import {Track} from "./Track";

type HipComponentEmitterType = {
    'onRaceStart': () => void,
    'onRoundStart': (args: Race) => void,
    'onRoundEnd': (args: Race) => void,
    'onHorseRoundStart':(args: { race:Race,horse:Horse,track:Track }) => void,
    'onHorseRoundEnd':(args: { race:Race,horse:Horse,track:Track }) => void,
    'onPlayerMove': (args: Race) => void,
}

/*
* 可触发事件表
* 2023.9.26 以此为准
* onRaceStart 比赛开始
* onRoundStart 回合开始
* onRoundEnd 回合结束
* onHorseRoundStart 开始计算选手回合
* onHorseRoundEnd 结束计算选手回合
* */
export class HipComponent extends EventEmitter<HipComponentEmitterType>{

}
