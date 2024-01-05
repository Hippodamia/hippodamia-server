import {Race} from "./core/Race";
import {Horse} from "./core/Horse";
import path from "path";
import {getFilesRecursively, readFilesRecursive} from "./utils";
import fs from "fs";

export class HippodamiaRandomEventManager {
    static events: Map<string, RandomEvent> = new Map();

    static register(event: RandomEvent) {

        this.events.set(event.name, event);
        console.log('[REM]Register random event: ' + event.name);
    }

    static get(name: string) {
        return this.events.get(name);
    }

    static getEventNames() {
        return this.events.keys();
    }


    static getRandom(){
        const events = Array.from(this.events.keys());
        const index = Math.floor(Math.random() * events.length);
        return this.get(events[index]);
    }

    static loadRandomEvents() {
        const scriptDirectory = path.join(__dirname, 'config/scripts');

/*        readFilesRecursive('./config/scripts',
            (file) => {
                const filePath = path.join(scriptDirectory, file);
                console.log('[REM]Loading script file:', filePath);
                if (path.extname(filePath) === '.js') {
                    try {
                        require(filePath);
                    } catch (error) {
                        console.error('Failed to load script file:', filePath, error);
                    }
                }
            })*/

        getFilesRecursively(path.resolve('./config/scripts')).forEach((file) => {
            console.log('[REM]Loading script file:', file);
            if (path.extname(file) === '.js') {
                try {
                   eval(fs.readFileSync(file).toString());
                } catch (error) {
                    console.error('Failed to load script file:', file, error);
                }
            }
        })

    }

}

export interface RandomEvent {
    name: string; //唯一name使用系列.xxx来确定
    alias: string;//别名，用于中文的表示
    type: RandomEventType;
    desc: string,//简化的描述
    handler: (race: Race, horse: Horse) => void
}

export enum RandomEventType {
    Positive,
    Negative,
    Neutral,
}
