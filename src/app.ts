import { Adapter, Bot, randomUser } from '@hippodamia/bot'
import { paginationTemplate } from "./bot/templates/commonTemplate";

import { startListen } from './api'
import { readShops } from "./bot/services/configService";
import { Hippodamia } from "./hippodamia";

import { GroupSettingsManager } from './managers/GroupSettingsManager';
import { CommandRouter } from './types';

//所有的命令路由
import * as Routers from './bot/routes'
//import { SandboxAdapter } from "@hippodamia/adapter-sandbox";
import ServerSettingsManager from './managers/ServerSettingsManager';
import { OneBotAdapter } from './OnebotAdapter';
import { RandomEventManager } from './components/random-events/RandomEventManager';


const bot = Hippodamia.instance.bot;

const i18n = Hippodamia.instance.i18n;

const RouteWithGroup = (router: CommandRouter): CommandRouter => {
    return (ctx) => {
        if (!ctx.channel) {
            ctx.reply(i18n['bot.require_channel'])
        } else {
            router(ctx)
        }
    }
}

/**
 * 包裹必须开启的
 * @param router
 * @constructor
 */
const RouteWithEnabled = (router: CommandRouter): CommandRouter => {
    return (ctx) => {
        const gsm = GroupSettingsManager.instance;

        if (gsm.get(ctx.channel?.id ?? 'global').enable) {
            router(ctx)
        } else {
            ctx.reply(i18n['bot.status_disabled'])
        }
    }
}
const RouteWithPermission = (router: CommandRouter): CommandRouter => {
    return (ctx) => {
        const gsm = GroupSettingsManager.instance;
        if (gsm.getAdminList(ctx.channel?.id).includes(ctx.user.id.toString())) {
            router(ctx)
        } else {
            ctx.logger.debug(JSON.stringify(gsm.getAdminList(ctx.channel?.id)))
            return ctx.reply(i18n['bot.no_permission'])
        }
    }
}

//指令树路由
bot.cmd('/小马积分', RouteWithEnabled(Routers.queryUserCoins))

bot.cmd('/创建赛马 <mode>', RouteWithEnabled(RouteWithGroup(Routers.createRace)))
bot.cmd('/race create <mode>', RouteWithEnabled(RouteWithGroup(Routers.createRace)))

bot.cmd({ command: '/dev fake player <count>' }, RouteWithEnabled(RouteWithGroup(Routers.addFakePlayer)))

bot.cmd('/race join <nick>', RouteWithEnabled(RouteWithGroup(Routers.joinRace)))
bot.cmd('/加入赛马 <nick>', RouteWithEnabled(RouteWithGroup(Routers.joinRace)))

bot.cmd('/race start', RouteWithEnabled(RouteWithGroup(Routers.startRace)))
bot.cmd('/开始赛马', RouteWithEnabled(RouteWithGroup(Routers.startRace)))

bot.cmd('/shops <page>', RouteWithEnabled(Routers.showShops))
bot.cmd('/小马商店 <page>', RouteWithEnabled(Routers.showShops))

//动态注册商店指令
for (const shop of readShops()) {
    bot.cmd(`/${shop.name} <page>`, RouteWithEnabled(Routers.showShopItems))
}

bot.cmd('/hippodamia reload', RouteWithPermission(Routers.hippodamiaRoutes['reloadConfig']))
bot.cmd('/hippodamia off', RouteWithPermission(Routers.hippodamiaRoutes.off))
bot.cmd('/hippodamia on', RouteWithPermission(Routers.hippodamiaRoutes.on))
bot.cmd('/hippodamia config', RouteWithPermission(Routers.hippodamiaRoutes.showGroupConfig))


//bot.commands.find(cmd => cmd.name == 'race')!.showHelp = true;


bot.cmd('/wiki event list <page>', (ctx) => {
    //create a string array of 100 items
    ctx.reply(paginationTemplate([], {
        size: 10,
        count: Number(ctx.args!.page ?? 1)
    }, "/wiki event list <page>"))
})

bot.cmd('/ping <str>', (ctx) => {
    console.log(ctx.args!.str)
    ctx.reply('pong' + ctx.args!.str)
})

//载入核心数据
//载入scripts
new RandomEventManager()
RandomEventManager.instance.loadRandomEvents()


//bot.load(new OPQAdapter('198.18.0.1:8086'))




const settings = ServerSettingsManager.instance.settings

switch (settings.mode) {
    case 'onebot':
        bot.load(new OneBotAdapter(settings.onebot))
    case 'test':
        //@ts-ignore
        //bot.load(new SandboxAdapter("reverse"))
}





startListen().then().catch(e => console.log(e));

