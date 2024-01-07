import {Adapter, Bot, randomUser} from '@hippodamia/bot'
import WebSocket from 'ws'
import {paginationTemplate} from "./bot/templates/commonTemplate";
import * as Routers from './bot/routes'

import {startListen} from './api'
import {readShops} from "./bot/services/configService";
import {HippodamiaRandomEventManager} from "./hippodamia";
import {OPQAdapter} from "./OPQAdapter";

import 'reflect-metadata'
import {doTest} from "./test";
import {Race} from "./core/Race";
import {randomEmoji} from "./utils";

const bot = new Bot();


//指令树路由
bot.cmd('/小马积分', Routers.queryUserCoins)

bot.cmd('/创建赛马 <mode>', Routers.createRace)
bot.cmd('/race create <mode>', Routers.createRace)

bot.cmd({command: '/dev fake player <count>'}, Routers.addFakePlayer)

bot.cmd('/race join <nick>', Routers.joinRace)
bot.cmd('/加入赛马 <nick>', Routers.joinRace)

bot.cmd('/race start', Routers.startRace)
bot.cmd('/开始赛马', Routers.startRace)

bot.cmd('/shops <page>', Routers.showShops)
bot.cmd('/小马商店 <page>', Routers.showShops)
//动态注册商店指令
for (const shop of readShops()) {
    bot.cmd(`/${shop.name} <page>`, Routers.showShopItems)
}


bot.commands.find(cmd => cmd.name == 'race').showHelp = true;
bot.cmd('/wiki event list <page>', (ctx) => {
    const cid = ctx.channel.id;

    //create a string array of 100 items
    function create100randomItems() {
        let arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push(randomUser().name);
        }
        return arr;
    }


    ctx.reply(paginationTemplate(create100randomItems(), {
        size: 10,
        count: Number(ctx.args.page ?? 1)
    }, "/wiki event list <page>"))
})

//载入核心数据
//载入scripts
HippodamiaRandomEventManager.loadRandomEvents()
bot.cmd('/ping <str>', (ctx) => {
    console.log(ctx.args.str)
    ctx.reply('pong'+ctx.args.str)
})

class SandboxAdapter1 implements Adapter {
    ws: WebSocket;
    info = {desc: '', name: 'sandbox', version: '0.1'};

    send(content: string | string[], target: { channel?: string; user?: string }) {
        console.log(content)
        if (typeof content == 'string')
            this.ws.send(JSON.stringify({author: 'bot', body: content, time: 1}))
        else
            this.ws.send(JSON.stringify({author: 'bot', body: content.join(''), time: 1}))
    };

    init(bot: Bot) {
        this.ws = new WebSocket("ws://127.0.0.1:8893");
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({body: 'test'}))
        })
        this.ws.on('message', (data) => {
            const message = data.toString();
            bot.emit('command', {user: {id: '114514'}, command: message, channel: {id: '10000'}, platform: 'sandbox'})
        })
    }
}

class MockAdapter implements Adapter {
    info = {desc: '', name: 'mock', version: '1'};

    send(content: string | string[], target: { channel?: string; user?: string }) {
        console.log("bot:\n" + content);
    };

    init(bot: Bot) {
    }
}

//bot.load(new MockAdapter())

bot.load(new OPQAdapter('198.18.0.1:8086'))

// 获取传递进来的参数
const args = process.argv.slice(2);
switch (args[0]) {
    case 'test_random_events':

        //检查所有的事件
        Array.from(HippodamiaRandomEventManager.getEventNames()).forEach(eventName => {

            const event = HippodamiaRandomEventManager.get(eventName)
            console.log(`正在测试:${event.name}(${event.alias})`)
            try {
                const race = new Race({speed: 10, length: 20, mode: 'random'})
                '0'.repeat(6).split('').forEach(x => {
                    race.join(randomUser(), randomEmoji());
                })
                race.start()
                for (let i = 0; i < 7; i++) {
                    //随机设置每一个选手的位置,并执行时间
                    race.getHorses().forEach(x => {
                        x.step = Math.floor(Math.random() * 20);
                        event.handler(race, x);
                    })
                }


            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m','问题:' + e)
            }
            console.log(`测试完成:${event.name}(${event.alias})`)

        })

        break;
    case 'test':
        doTest().then()
        break;
    case 'app':
        break;
}
//自带的coins api
startListen().then().catch(e => console.log(e));

//

export {bot}
