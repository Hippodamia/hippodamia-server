import { BuffContainer } from "./BuffContainer";
import { Track } from "./Track";

export class Segment {
  constructor() {
    this.buffs = new BuffContainer<Segment>();
  }
  buffs: BuffContainer<Segment>;



}
