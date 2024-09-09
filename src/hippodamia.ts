import { BaseLogger, Bot } from "@hippodamia/bot";

import { I18n } from "@/utils/I18n";
import ServerSettingsManager from "./managers/ServerSettingsManager";
import { packageDirectorySync } from "pkg-dir";

import { createLogger } from "bunyan";
import { wrapLogger, createNanoLogger } from "./utils";

const pretty = require('@mechanicalhuman/bunyan-pretty')

export class Hippodamia {

    static instance: Hippodamia;

    logger!: BaseLogger;

    i18n!: I18n & { [key: string]: string; }

    bot!: Bot

    /**
     * Hippodamia 核心类
     * @returns {Hippodamia} 
     */
    constructor() {
        if (Hippodamia.instance)
            return Hippodamia.instance;

        const logger_level = ServerSettingsManager.instance.settings.logging.level;

        const bunyanLogger = (sevice: string) => {
            return wrapLogger(logger_level, createLogger({
                name: sevice,
                level: logger_level,
                stream: pretty(process.stdout, { timeStamps: false }),
            }))
        }

        if (process.platform === 'linux')
            //this.logger = bunyanLogger("hippodamia")
            this.logger = createNanoLogger("hippodamia", logger_level)
        else
            this.logger = createNanoLogger("hippodamia", logger_level)


        this.bot = new Bot({
            //logger: process.platform === 'linux' ? bunyanLogger("bot") : createNanoLogger("bot", logger_level)
            logger: createNanoLogger("bot", logger_level)
        })

        this.i18n = new I18n('zh_cn', packageDirectorySync() + '/config/languages', this.logger).build() as any
        Hippodamia.instance = this
    }
}