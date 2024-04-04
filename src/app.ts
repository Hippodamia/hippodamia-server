import {Adapter, Bot, randomUser} from '@hippodamia/bot'
import {paginationTemplate} from "./bot/templates/commonTemplate";

import {startListen} from './api'
import {readShops} from "./bot/services/configService";
import {Hippodamia, HippodamiaRandomEventManager, i18n} from "./hippodamia";

import {GroupSettingsManager} from './managers/GroupSettingsManager';
import {CommandRouter} from './types';

//所有的命令路由
import * as Routers from './bot/routes'
import {SandboxAdapter} from "@hippodamia/adapter-sandbox";


const bot = new Bot({loggerLevel: 'debug'});


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
        if (GroupSettingsManager.get(ctx.channel?.id ?? 'global').enable) {
            router(ctx)
        } else {
            ctx.reply(i18n['bot.status_disabled'])
        }
    }
}
const RouteWithPermission = (router: CommandRouter): CommandRouter => {
    return (ctx) => {
        if (GroupSettingsManager.getAdminList(ctx.channel?.id).includes(ctx.user.id.toString())) {
            router(ctx)
        } else {
            ctx.logger.debug(JSON.stringify(GroupSettingsManager.getAdminList(ctx.channel?.id)))
            return ctx.reply(i18n['bot.no_permission'])
        }
    }
}

//指令树路由
bot.cmd('/小马积分', RouteWithEnabled(Routers.queryUserCoins))

bot.cmd('/创建赛马 <mode>', RouteWithEnabled(RouteWithGroup(Routers.createRace)))
bot.cmd('/race create <mode>', RouteWithEnabled(RouteWithGroup(Routers.createRace)))

bot.cmd({command: '/dev fake player <count>'}, RouteWithEnabled(RouteWithGroup(Routers.addFakePlayer)))

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

bot.cmd('/hippodamia reload', RouteWithPermission(Routers.hippodamiaRoutes.reloadConfig))
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

//载入核心数据
//载入scripts
HippodamiaRandomEventManager.loadRandomEvents()
//载入群组配置
GroupSettingsManager.reload()
bot.cmd('/ping <str>', (ctx) => {
    console.log(ctx.args!.str)
    ctx.reply('pong' + ctx.args!.str)
})


class MockAdapter implements Adapter {
    info = {desc: '', name: 'mock', version: '1'};

    send(content: string | string[], target: { channel?: string; user?: string }) {
        console.log("bot:\n" + content);
    };

    init(bot: Bot) {
    }
}

//bot.load(new MockAdapter())

//bot.load(new OPQAdapter('198.18.0.1:8086'))
bot.load(new SandboxAdapter("reverse"))

new Hippodamia(bot);

startListen().then().catch(e => console.log(e));

