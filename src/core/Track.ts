import {BuffContainer} from "./BuffContainer";
import {Horse} from "./Horse";
import {Segment} from "./Segment";
import {Race} from "./Race";

export class Track {
    //初始化轨道内部的Segment(格)
    constructor() {
        for (let i = 0; i < 14; i++) {
            const segment = new Segment();
            this.segments.push(segment);
        }
        this.buffs = new BuffContainer<Track>();
    }

    buffs: BuffContainer<Track>;
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
        this.buffs.call<void, any>("onTrackRoundStart", undefined, this, {race});

        this.segments.forEach((s) =>
            s.buffs.call<void, any>("onSegmentRoundStart", undefined, s,{race})
        );
        this.segments.forEach((s) => s.buffs.refresh());

        for (let horse of this.horses) {
            horse.next(race,this);

        }
        this.buffs.call<void, any>("onTrackRoundEnd", undefined, this,{race});

        this.buffs.refresh();
    }
}
