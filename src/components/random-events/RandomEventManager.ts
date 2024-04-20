import { HorseStatus, IContentManager } from '@hippodamia/core';
import { RandomEvent, RandomEventType } from './types';
import { getFilesRecursively } from '../../utils';
import { packageDirectorySync } from 'pkg-dir'
import * as path from "node:path"
import * as fs from "node:fs"
import { BaseLogger } from '@hippodamia/bot';

import vm from 'node:vm'
import { HorseUtils } from '@/utils/HorseUtils';


export class RandomEventManager implements IContentManager<RandomEvent> {

    static instance: RandomEventManager;

    logger!: BaseLogger;

    constructor(logger: BaseLogger) {
        if (RandomEventManager.instance)
            return RandomEventManager.instance;

        this.logger = logger;
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
        this.logger.info('[REM] 注册事件' + event.name + ' | ' + event.alias);
    }

    get(name: string) {
        return this.events.get(name);
    }

    listNames() {
        return this.events.keys();
    }

    loadRandomEvents() {
        const ctx = vm.createContext(
            {
                RandomEventManager,
                HorseUtils,
                HorseStatus,
            }
        );
        const root = packageDirectorySync() + '/config/scripts/random_events';
        if (root) {
            getFilesRecursively(root).forEach((file) => {
                if (path.extname(file) === '.js') {
                    try {
                        let text = fs.readFileSync(file).toString();
                        const result = text.replace(/\/\/remove([\s\S]*?)\/\/remove/g, '');
                        //eval(result);
                        vm.runInContext(result, ctx);
                        this.logger.info('[REM] 加载脚本文件完成:\n' + file);
                    } catch (error) {
                        this.logger.error({ message: '[REM] 加载脚本文件异常', file, error });
                    }
                }
            });
        }


    }

}
