import {Buff} from "./types";
import {HipComponent} from "./HipComponent";
import {EventEmitter} from "eventemitter3";


export class BuffContainer<S> {


    _buffs: Buff[] = [];

    push(buff: Buff) {

        let find = this._buffs.find(b => b.name == buff.name);
        if (find) {
            find.time += buff.time;
        } else {
            this._buffs.push(buff)
        }

    }

    get() {
        return this._buffs;
    }

    //刷新所有buff的剩余回合数
    refresh() {
        for (let i = 0; i < this._buffs.length; i++) {
            const buff = this._buffs[i];
            buff.time--;
            if (buff.time <= 0) {
                this._buffs.splice(i, 1);
                i--;
            }
        }
    }

    call<T, P>(event: string, target: T, source: S, param: P | undefined = undefined): T {
        for (let buff of this._buffs) {
            if (buff.listener[event]) {
                if (param) {
                    target = buff.listener[event]?.(target, {
                        ...param,
                        ...source
                    });
                } else {
                    target = buff.listener[event]?.(target, {
                        source
                    });
                }
            }
        }
        return target;
    }
}


export class BuffPool {
    private pool: Map<string, Buff>
    private nameDic: Map<string, string>

    constructor() {
        this.pool = new Map<string, Buff>()
        this.nameDic = new Map<string, string>();
    }

    register(id: string, buff: Buff) {
        this.pool.set(id, buff)
    }

    get(id: string) {
        return this.pool.get(id)
    }

    getWithName(name: string) {
        const id = this.nameDic.get(name)
        if (id)
            return this.get(id)
        else
            return undefined
    }
}
