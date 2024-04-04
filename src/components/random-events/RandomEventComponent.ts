import { HipComponent, Horse, IContentManager, Race } from '@hippodamia/core'
import { RandomEvent } from './types';

export class RandomEventComponent extends HipComponent {
    constructor(manager: IContentManager<RandomEvent>) {
        super();

        // TODO 处理事件列表，允许根据人数删除一部分事件索引，尽量根据事件唯一id列表来处理

        this.on("horse.round.start", (race, horse) => {
            if (Math.random() < 0.5) {
                //从事件列表中获取一个事件
                const random = manager.getRandom(() => true);
                console.debug('[REM]执行事件:' + random.name + '->' + horse.raw_display)
                //为玩家数据库增加玩家触发事件的记录
                random.handler(race, horse)
            }

        })
    }

    info() {
        return {
            name: 'random',
            alias: ['RandomEvent']
        }
    }
}



