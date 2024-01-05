
import {HipComponent} from "../HipEventEmitter";
import {HippodamiaRandomEventManager} from "../../hippodamia";

export class FortuityDay extends HipComponent{
    constructor() {
        super();

        this.load()

        //todo 处理事件列表，允许根据人数删除一部分事件索引，尽量根据事件唯一id列表来处理

        this.on("horse.round.start",(race,horse)=>{
            if(Math.random() < 0.5){
                //从事件列表中获取一个事件
                const random = HippodamiaRandomEventManager.getRandom();
                console.debug('[REM]执行事件'+random.name)
                random.handler(race,horse)
            }

        })
    }

    load() {

    }

}
