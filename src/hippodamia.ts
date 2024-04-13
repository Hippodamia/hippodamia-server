import { BaseLogger, Bot } from "@hippodamia/bot";

import { I18n } from "@/utils/I18n";
import ServerSettingsManager from "./managers/ServerSettingsManager";
import { packageDirectorySync } from "pkg-dir";

import { createLogger } from "bunyan";
import { wrapLogger } from "./utils";

const pretty = require('@mechanicalhuman/bunyan-pretty')

export class Hippodamia {

    static instance: Hippodamia;

    logger!: BaseLogger;

    i18n!: I18n & { [key: string]: string; }

    bot!: Bot

    constructor() {
        if (Hippodamia.instance)
            return Hippodamia.instance;

        const logger_level = ServerSettingsManager.instance.settings.logging.level;

        this.logger = wrapLogger(logger_level, createLogger({
            name: "hippodamia",
            level: logger_level,
            stream: pretty(process.stdout, { timeStamps: false }),
        }))

        this.bot = new Bot({
            logger: wrapLogger(logger_level, createLogger({
                name: "bot",
                level: logger_level,
                stream: pretty(process.stdout, { timeStamps: false }),
            })),
        })

        this.i18n = new I18n('zh_cn', packageDirectorySync() + '/config/languages', this.logger).build() as any
        Hippodamia.instance = this
    }
}