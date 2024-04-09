import { IContentManager } from '@hippodamia/core';
import { RandomEvent, RandomEventType } from './types';
import { getFilesRecursively } from '../../utils';
import { packageDirectorySync } from 'pkg-dir'
import * as path from "node:path"
import * as fs from "node:fs"


export class RandomEventManager implements IContentManager<RandomEvent> {

    static instance: RandomEventManager;

    constructor() {
        if (RandomEventManager.instance) {
            return RandomEventManager.instance;
        }
        RandomEventManager.instance = this;
        this.loadRandomEvents();
    }

    getRandom(filter: (content: RandomEvent) => boolean) {

        const events = Array.from(this.events.keys());
        const index = Math.floor(Math.random() * events.length);
        return this.get(events[index]) ?? {
            name: 'NULL',
            alias: '空白誓约',
            type: RandomEventType.Neutral,
            desc: "There's Nothind",
            handler: () => {
            }
        };
    };
    getAll() {
        return Array.from(this.events.values());
    };


    /**
     * 随机事件的列表
     */
    events: Map<string, RandomEvent> = new Map();

    register(event: RandomEvent) {
        this.events.set(event.name, event);
        console.log('[REM]Register random event: ' + event.name + '|' + event.alias);
    }

    get(name: string) {
        return this.events.get(name);
    }

    listNames() {
        return this.events.keys();
    }

    loadRandomEvents() {
        const root = packageDirectorySync() + '/config/scripts/random_events';
        if (root) {
            getFilesRecursively(root).forEach((file) => {
                if (path.extname(file) === '.js') {
                    try {
                        let text = fs.readFileSync(file).toString();
                        const result = text.replace(/\/\/remove([\s\S]*?)\/\/remove/g, '');
                        eval(result);
                        console.log('[REM]Loaded script file:', file);
                    } catch (error) {
                        console.error('Failed to load script file:', file, error);
                    }
                }
            });
        }


    }

}
