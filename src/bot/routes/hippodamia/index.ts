import { Hippodamia } from "@/hippodamia";
import { GroupSettingsManager } from "@/managers/GroupSettingsManager";
import { CommandRouter } from "@/types";

const gsm = GroupSettingsManager.instance;
const i18n = Hippodamia.instance.i18n;

export const hippodamiaRoutes: { [key: string]: CommandRouter } = {

    'reloadConfig': async (ctx) => {

        ctx.logger.info('重载配置文件')
        gsm.reload();

        ctx.reply(i18n['bot.reloaded'])

    },

    'showGroupConfig': async (ctx) => {

        let set = gsm.get(ctx.channel?.id ?? 'global');

        ctx.reply('本群使用配置如下\n' + JSON.stringify(set, null, 2));
    },
    'reloadEvents': async (ctx) => {

    },

    'off': async (ctx) => {
        let g = ctx.channel!.id;
        gsm.set(g, { enable: false });
        ctx.reply(i18n['bot.disabled'])
        ctx.logger.info(`群${g}已关闭赛马bot能力`)
    },


    'on': async (ctx) => {
        let g = ctx.channel!.id;
        gsm.set(g, { enable: true });
        ctx.reply(i18n['bot.enabled'])

        ctx.logger.info(`群${g}已开启赛马bot能力`)
    }
}


