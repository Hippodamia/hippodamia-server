import { paginationTemplate } from "./bot/templates/commonTemplate";

import { startListen } from './api'
import { readShops } from "./bot/services/configService";
import { Hippodamia } from "./hippodamia";

import { GroupSettingsManager } from './managers/GroupSettingsManager';
import { CommandRouter } from './types';

//所有的命令路由
import * as Routers from './bot/routes'
//import { SandboxAdapter } from "@hippodamia/adapter-sandbox";
import ServerSettingsManager, { ServerSettings } from './managers/ServerSettingsManager';
import { OneBotAdapter } from './adapters/OnebotAdapter';
import { RandomEventManager } from './components/random-events/RandomEventManager';

import * as fs from 'fs';
import { resolve } from 'path';
import { packageDirectorySync } from 'pkg-dir';
import { update, version } from "./update";

import inquirer from "inquirer";
import { QQGroupAdapter } from "./adapters/QQGroupAdapter";

console.log('Hippodamia Server 启动中...')


// 检查是否有package.json文件,如果没有则创建一个
if (!fs.existsSync(resolve('./package.json')))
    fs.writeFileSync(resolve('./package.json'), JSON.stringify({
        name: 'hippodamia-server',
        version
    }))


// 创建config文件夹
if (!fs.existsSync(resolve('./config'))) {
    fs.mkdirSync(resolve('./config'), { recursive: true })
}

// 创建config/settings.json文件
if (!fs.existsSync(resolve('./config/settings.json'))) {
    fs.writeFileSync(resolve('./config/settings.json'), JSON.stringify(
        {
            logging: {
                level: 'info',
            },
            mode: 'onebot',
            onebot: {
                mode: 'http',
                api: 'http://127.0.0.1:5700'
            }
        } as ServerSettings
    ))
}

// 更新
// if (Bun.env.NODE_ENV != 'development' && !await update())
//     process.exit(0)


// 根据启动参数载入配置文件
const arg = process.argv.length > 2 ? process.argv[2] : undefined;


// 初始化服务设置管理器
let setting_path: string;
if (arg) {
    setting_path = `${packageDirectorySync()}/config/settings${arg ? '.' : ''}${arg}.json`;
} else {
    setting_path = `${packageDirectorySync()}/config/settings.json`;
    const files = fs.readdirSync(`${packageDirectorySync()}/config/`)
        .filter(file => file.startsWith('settings') && file.endsWith('.json'))
    const select = await inquirer.prompt({
        type: 'list',
        name: 'file',
        message: '请选择配置文件',
        choices: files
    })
    setting_path = `${packageDirectorySync()}/config/${select.file}`
    console.log('使用配置文件:', setting_path)
}

console.log('使用配置文件:', setting_path)


// 初始化服务设置管理器
new ServerSettingsManager(fs.existsSync(setting_path) ? setting_path : undefined);

// 初始化群组设置管理器
new GroupSettingsManager()

// 初始化Hippodamia核心
new Hippodamia()

const logger = Hippodamia.instance.logger;

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

bot.cmd('/hippodamia|赛马 reload', RouteWithPermission(Routers.hippodamiaRoutes['reloadConfig']))
bot.cmd('/hippodamia|赛马 off', RouteWithPermission(Routers.hippodamiaRoutes.off))
bot.cmd('/hippodamia|赛马 on', RouteWithPermission(Routers.hippodamiaRoutes.on))
bot.cmd('/hippodamia|赛马 config', RouteWithPermission(Routers.hippodamiaRoutes.showGroupConfig))

// 重载事件
bot.cmd('hippodamia|赛马 reload random_events|re', (ctx) => {

})

bot.cmd('hippodamia|赛马 update random_events|re', (ctx) => {

})

//bot.commands.find(cmd => cmd.name == 'race')!.showHelp = true;


bot.cmd('/wiki|图鉴 event|事件|re list|l|列表 <page>', (ctx) => {
    let page
    if (ctx.args?.page && !isNaN(Number(ctx.args?.page)))
        page = Number(ctx.args?.page)
    else
        page = 1
    //create a string array of 100 items
    ctx.reply(paginationTemplate(RandomEventManager.instance.getAll().map(event => event.alias + '|' + event.name), {
        size: 10,
        count: Number(page)
    }, "/wiki event list <page>"))
})


bot.cmd('/ping <str>', (ctx) => {
    console.log(ctx.args!.str)
    ctx.reply('pong' + ctx.args!.str)
})

bot.cmd('赫尔好可爱', (ctx) => {
    ctx.reply('哼哼...啊啊啊啊!')
})
bot.cmd('抢劫小马商店', (ctx) => {
    ctx.reply('商店还没开放呢...')
})


logger.info('命令路由加载完成')

//载入核心数据
//载入scripts
new RandomEventManager(logger)


//bot.load(new OPQAdapter('198.18.0.1:8086'))
const settings = ServerSettingsManager.instance.settings

logger.info('开始加载适配器...')


switch (settings.mode) {
    case 'onebot':
        if (!bot.adapters.find(adapter => adapter.info.name == 'onebot11'))
            bot.load(new OneBotAdapter(settings.onebot))
        else
            bot.logger.info('OneBotAdapter already loaded')
    case 'test':
        break;
    case 'qq-group':
        if (!bot.adapters.find(adapter => adapter.info.name == 'qq-group'))
            bot.load(new QQGroupAdapter(settings.bot))
        logger.info('QQGroupAdapter loaded')
        logger.warn('QQGroupAdapter is not fully supported yet, some features may not work properly')
    //@ts-ignore
    //bot.load(new SandboxAdapter("reverse"))
}



logger.info('启动 HTTP API服务')

logger.info('温馨提示:请不要修改config内任何官方发布的文件(包括random_events下的事件脚本,languages下的default文件),这些内容会在版本更新时被强制替换成最新版本')
startListen().then().catch(e => console.log(e));

