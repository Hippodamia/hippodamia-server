import { Bot } from "@hippodamia/bot";

import { I18n } from "./utils";
import ServerSettingsManager from "./managers/ServerSettingsManager";


export class Hippodamia {

    static instance: Hippodamia;

    i18n: I18n & { [key: string]: string; } = new I18n('zh_cn', './config/languages').build() as any

    bot!: Bot

    constructor() {
        if(Hippodamia.instance)
            return Hippodamia.instance;
        this.bot = new Bot({ loggerLevel: ServerSettingsManager.instance.settings.logging.level })
        Hippodamia.instance = this
    }

}