import { Bot } from "@hippodamia/bot";

import { I18n } from "@/utils/I18n";
import ServerSettingsManager from "./managers/ServerSettingsManager";
import { packageDirectorySync } from "pkg-dir";

import { createLogger } from "bunyan";

const pretty = require('@mechanicalhuman/bunyan-pretty')

export class Hippodamia {

    static instance: Hippodamia;

    i18n: I18n & { [key: string]: string; } = new I18n('zh_cn', packageDirectorySync() + '/config/languages').build() as any

    bot!: Bot

    constructor() {
        if (Hippodamia.instance)
            return Hippodamia.instance;

        const logger_level = ServerSettingsManager.instance.settings.logging.level;

        const logger = createLogger({
            name: "hippodamia-server",
            level: logger_level,
            stream:pretty(process.stdout, { timeStamps: false }),
        })

        this.bot = new Bot({
            logger: {
                level: "info",
                info: (data: any | string) => logger.info(data),
                error: (data: any) => logger.error(data),
                debug: (data: any) => logger.debug(data),
                warn: (data: any) => logger.warn(data),
                trace: (data: any) => logger.trace(data),
                fatal: (data: any) => logger.fatal(data)
            }
        })
        Hippodamia.instance = this
    }
}