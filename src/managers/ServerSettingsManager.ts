import { One } from 'drizzle-orm';
import fs from 'node:fs';
import { OneBotConfig } from '../OnebotAdapter';
import { packageDirectorySync } from 'pkg-dir';


interface HippodamiaAPISettings {
    api: {
        port: number,
    }
}

type OnebotServerSettings = {
    mode: 'onebot',
    onebot: OneBotConfig
}
type TestServerSettings = {
    mode: 'test',
    test: OneBotConfig
}

type LoggingSettings = {
    level: 'info' | 'debug' | 'warn' | 'error'
}

type ServerSettings = HippodamiaAPISettings & (OnebotServerSettings | TestServerSettings) & {
    logging: LoggingSettings
};

export default class ServerSettingsManager {
    public static instance: ServerSettingsManager;


    settings: ServerSettings;

    path:string

    constructor(path?:string) {
        if(!path)
            this.path = `${packageDirectorySync()}/config/settings.json`
        else
            this.path = path
        if (!ServerSettingsManager.instance)
            ServerSettingsManager.instance = this;
        this.settings = this.defaultSetttings();

        this.load()

    }

    /**
     * 读取settings.json下关于赛马服务器的配置信息
     */
    load() {
        try {
            this.settings = JSON.parse(fs.readFileSync(this.path, 'utf-8').toString()) as ServerSettings;
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }



    /**
     * 获取默认的服务配置
     * @returns 默认的设置
     */
    defaultSetttings(): ServerSettings {
        return {
            api: {
                port: 3001
            },
            mode: 'onebot',
            onebot: {
                mode: 'null'
            },
            logging: {
                level: 'info'
            }
        }
    }
}