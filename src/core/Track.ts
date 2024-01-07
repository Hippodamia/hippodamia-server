import {BuffContainer} from "./BuffContainer";
import {Horse} from "./Horse";
import {Segment} from "./Segment";
import {Race} from "./Race";

export class Track {
    //初始化轨道内部的Segment(格)
    constructor(length   = 26) {
        for (let i = 0; i < length; i++) {
            const segment = new Segment();
            this.segments.push(segment);
        }
        //this.buffs = new BuffContainer<Track,any>();
    }

    //buffs: BuffContainer<Track,any>; //todo track也允许拥有buff，用于影响整个赛道以及选手。
    horses: Horse[] = [];
    segments: Segment[] = [];

    addHorse(horse: Horse) {
        horse.track = this;
        this.horses.push(horse);
    }

    removeHorse(horse: Horse) {
        this.horses.splice(this.horses.indexOf(horse), 1);
        horse.track = undefined;
    }

    next(race: Race) {
        //todo 用于给track的buff系统
        for (let horse of this.horses) {
            race.components.forEach(c=>c.emit("track.round.end", race, this))
            horse.next(race,this);
        }
    }
}
