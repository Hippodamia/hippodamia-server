import { BuffContainer } from "./BuffContainer";
import { Track } from "./Track";

export class Segment {
  constructor() {
    this.buffs = new BuffContainer<Segment, any>();
  }
  buffs: BuffContainer<Segment,any>;
}
