//remove
/// <reference path="../../../dist/types.d.ts" />
const {Horse} = require("core/Horse")
const {Race} = require("core/Race")
const {EffectType} = require("core/types")
const { RandomEventManager } = require("src/components/random-events/RandomEventManager")

//remove

/**
 * @typedef {Object} RandomEvent
 * @property {string} name - 唯一name使用系列.xxx来确定
 * @property {string} alias - 别名,用于中文的表示
 * @property {number} type - 类型
 * @property {string} desc - 简化的描述
 * @property {(race: Race, horse: Horse) => void} handler - 处理函数
 */


/**
 * @typedef {import("core/types").Buff<import("core/Horse").HorseProperty>} Buff
 */


/**
 * woohoo buff
 * @type {Buff}
 */
const wohoo_buff = {
    name: 'WOO-HOO之力',
    type: 0,
    desc: 'WOO HOO! 起飞! 小幅度增加速度、幸运与效果抵抗',
    canStack: true,
    modifier: (target, buff) => {
        //提升选手1点速度,5%幸运和5%效果抵抗
        target.speed += 1 * buff.stacks
        target.luck += 0.05 * buff.stacks
        target.effect_resistance += 0.05 * buff.stacks
        target.display = `<芜湖之力:${buff.stacks}层>` + target.display
        return target
    }
}


/**
 *  普通芜湖力量
 * @type {RandomEvent}
 */
const normal_woohoo_power = {
    name: 'woohoo.power.normal',
    alias: '普通芜湖力量',
    type: 0,
    desc: '普通的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        horse.move(1);
        race.pushLog(horse, '%player%被神奇的力量包裹,直接前进了1格');
    }
}


/**
 * 黄金芜湖力量
 * @type {RandomEvent}
 */
const gold_woohoo_power = {
    name: 'woohoo.power.gold',
    alias: '黄金芜湖力量',
    type: 0,
    desc: '普通的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        horse.move(2);
        race.pushLog(horse, '%player%被金色的光芒包裹,直接前进了2格');
    }
}


const brilliant_woohoo_power = {
    name: 'woohoo.power.brilliant',
    alias: '璀璨芜湖力量',
    type: 0,
    desc: '璀璨的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        horse.move(3);
        race.pushLog(horse, '%player%被璀璨的五彩斑斓之光包裹,直接前进了3格');
    }
}

const supreme_woohoo_power = {
    name: 'woohoo.power.supreme',
    alias: '至尊芜湖力量',
    type: 0,
    desc: '至尊的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        horse.move(4);
        race.pushLog(horse, '%player%被难以言表的至尊力量包裹,直接越过了4格');
    }
}

const ultrafast_dark_woohoo = {
    name: 'woohoo.power.ultrafast_dark',
    alias: '超速黑暗芜湖',
    type: 2, // Neutral
    desc: '黑色的死亡笼罩了玩家,但也带来神奇的力量',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)

        horse.move(2);
        race.pushLog(horse, '%player%被黑色的死亡笼罩,并获得了邪恶但强大的力量。');

        horse.buffContainer.add({
            name: '超速黑暗芜湖',
            type: 2,
            desc: '死亡的力量?',
            priority: 1,
            modifier: (target, buff) => {
                target.speed += 10;
                target.display = `<吞噬:${buff.remains}>` + target.display
                return target
            },
            listeners: {
                'buff.end': (ctx) => {
                    ctx.horse.Property = {...ctx.horse.Property, status: 1}
                    console.debug('选手死亡')
                }
            }
        }, 3)
    }
}

/**
 * 绝对力量芜湖
 * @type {RandomEvent}
 */
const absolute_power_woohoo = {
    name: 'woohoo.power.absolute',
    alias: '绝对力量芜湖',
    type: 0, // Positive
    desc: '绝对的力量赋予了玩家无可比拟的速度',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        horse.move(999); // move to the end of track
        race.pushLog(horse, '%player%被绝对的力量笼罩,一踏出便到达了赛道的终点!');
    }
}


/**
 * 万寂逝影芜湖
 * @type {RandomEvent}
 */
const shadows_woohoo = {
    name: "woohoo.power.shadows",
    alias: "万寂逝影芜湖",
    type: 0,
    desc: "选手领悟芜湖真理,获得+4速度,每回合概率前进1格",
    handler: function (race, horse) {

        /**
         * 万寂逝影
         * @type {Buff}
         */
        const buffWuhuTruth = {
            name: "万寂逝影",
            type: 0,
            desc: "芜湖真理的力量?",
            modifier: (target, buff) => {
                // 提升速度
                target.speed += 4;
                return target;
            },
            listeners: {
                'horse.round.end': (race, horse) => {
                    if (Math.random() < 0.5) {
                        horse.move(1);
                        race.pushLog(horse, '万寂逝影!千锋断绝!%player%前进了1格!');
                    }
                }
            }
        };
        horse.buffContainer.add(wohoo_buff, 99, 1)
        // 添加 Buff到 BuffContainer
        horse.buffContainer.add(buffWuhuTruth, 5);
        race.pushLog(horse, '%player%领悟了WOOHOO真理,获得了万寂逝影的力量!(获得+4速度,每回合概率前进1格,持续5回合)');
    }
};

/**
 * 友谊魔法芜湖
 * @type {RandomEvent}
 */
const friendship_magic_woohoo = {
    name: 'woohoo.power.friendship_magic',
    alias: '友谊魔法芜湖',
    type: 0, // Positive
    desc: '友谊带来了神奇的芜湖力量',
    handler: (race, horse) => {
        for (let horse of race.getHorses()) {
            horse.move(horse.track.segments.length); // move all horses to the end of track
        }
        race.pushLog(horse, '友谊的魔法发动,所有参赛者都被芜湖力量包裹,一同冲向了终点!');
    }
}

/**
 * 芜湖法杖V12
 * @type {RandomEvent}
 */
const woohoo_staff_v12 = {
    name: 'woohoo.staff.v12',
    alias: '芜湖法杖V12',
    type: 0, // Positive
    desc: '全新的芜湖法杖赋予了玩家神奇的力量',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)
        const effects = [
            {desc: '获得了加速魔法,速度永久提升1', handler: () => horse.Property.speed += 1},
            {desc: '获得了加加速魔法,速度永久提升2', handler: () => horse.Property.speed += 2},
            {desc: '获得了抵抗魔法,效果抵抗永久提升10%', handler: () => horse.Property.effect_resistance += 0.1},
            {desc: '获得了步数提升魔法,前进一格1', handler: () => horse.step += 1},
        ];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect.handler();
        race.pushLog(horse, '%player%挥动了芜湖法杖,' + randomEffect.desc);
    }
}

//todo 反芜湖咒语

/**
 * 芜湖法杖V12
 * @type {RandomEvent}
 */
const woohoo_coffee = {
    name: 'woohoo.coffee',
    alias: '超验芜湖左旋咖啡',
    type: 0, // Positive
    desc: '超验芜湖左旋咖啡,令人倍感精神',
    handler: (race, horse) => {
        horse.Property = {...horse.Property, speed: horse.Property.speed + 3};
        race.pushLog(horse, '%player%喝下了一杯芜湖咖啡,感觉精神倍加,速度提升!');
    }
}

/**
 * 你不懂芜湖
 * @type {RandomEvent}
 */
const youDontUnderstandWoohoo = {
    name: 'woohoo.youDontUnderstand',
    alias: '你不懂芜湖',
    type: 0, // Positive
    desc: '令随机一个选手下一回合进入「怀疑」状态,持续3回合',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)

        const doubtfulStatus = {
            name: '怀疑',
            type: 1,
            desc: '陷入怀疑,速度减慢,丧失自我认知',
            modifier: (target, buff) => {
                target.speed -= 2
                target.display = '????';
                return target;
            }
        };
        horse.buffContainer.add({
            name: '怀疑制造者(匿名buff)',
            type: 0,
            desc: '令随机一个选手进入怀疑',
            listeners: {
                'buff.end': (ctx) => {
                    const others = ctx.race.getOthers([ctx.horse])
                    let other = others[Math.floor(Math.random() * others.length)]
                    other.buffContainer.add(doubtfulStatus, 3);
                }
            }
        }, 1)
        race.pushLog(horse, '%player%触发了「你不懂芜湖」,下一场比赛中随机一匹马匹将会受到「怀疑」效果影响。');
    }
}

// 定义一个新的 RandomEvent 类型
const luckyCatEvent = {
    name: "woohoo.luckyCat",
    alias: "芜湖小猫",
    type: 0, // Positive
    desc: "小猫看了你一眼赐予了你速度+99效果，持续4回合",
    handler: function (race, horse) {
        horse.buffContainer.add(wohoo_buff, 99, 1)

        horse.buffContainer.add({
            name: '芜湖小猫祝福',
            type: 0,  // Positive
            desc: '芜湖小猫的祝福：速度增加',
            priority: 1,
            modifier: (target, buff) => {
                target.speed += 99;
                target.display = `<喵:${buff.remains}>` + target.display
                return target
            }
        }, 4);  // buff 持续 4 rounds

        race.pushLog(horse, "%player%被WOOHOO小猫看了一眼,获得了持续4回合的速度+99效果");

    }
};

/**
 * 这才是wohoo起飞
 * @type {RandomEvent}
 */
const wohooTakeoffEvent = {
    name: 'woohoo.takeoff',
    alias: '这才是wohoo起飞',
    type: 0, // Positive Event
    desc: '选手直接芜湖起飞，滚滚热浪击退身后的对手，自身+2步数,身后选手-2步数',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99, 1)

        // 自身+2步数
        horse.move(2);
        race.pushLog(horse, '%player%芜湖起飞了,自身加2步数!');

        // 找到身后的选手并-2步数
        const others = race.getOthers([horse]);
        others.sort((player1, player2) => player2.step - player1.step);
        const horseBehind = others.filter(player => player.step < horse.step);
        if (horseBehind) {
            horseBehind.forEach(player => {
                player.move(-2)
                race.pushLog(player, `${player.raw_display}被滚滚热浪击退，步数减2！`);
            });

        }
    }
}

/**
 * 芜湖芜湖芜湖
 * @type {RandomEvent}
 */
const tripleWoohooEvent = {
    name: 'woohoo.wwwhhh',
    alias: '芜湖芜湖芜湖',
    type: 0, // Positive Event
    desc: '选手高呼三声芜湖，为身后的三位选手赋予「芜湖之力」。当身后选手数量小于三位时，每少一位，自身获得额外一层芜湖之力',
    handler: (race, horse) => {

        // 找到身后的选手
        const others = race.getOthers([horse]);
        others.sort((player1, player2) => player2.step - player1.step);  // Sort players by steps in decreasing order
        const horsesBehind = others.filter(player => player.step < horse.step);
        //horse.play()
        // 对最多三个身后的选手赋予「芜湖之力」
        const buffsCount = Math.min(3, horsesBehind.length);
        for (let i = 0; i < buffsCount; i++) {
            horsesBehind[i].buffContainer.add(wohoo_buff, 1);
            race.pushLog(horsesBehind[i], `%player%高呼三声芜湖!赐予了${horsesBehind[i].raw_display}芜湖之力!`);
        }

        // 如果身后的选手少于三位，为当前选手赋予额外的「芜湖之力」
        if (horsesBehind.length < 3) {
            const extraBuff = 3 - horsesBehind.length;
            horse.buffContainer.add(wohoo_buff, extraBuff);
            race.pushLog(horse, '%player%高呼三声芜湖!自身额外获得' + extraBuff + '层芜湖之力');
        }
    }
}

RandomEventManager.instance.register(normal_woohoo_power)//正常芜湖
RandomEventManager.instance.register(gold_woohoo_power)//金芜湖
RandomEventManager.instance.register(brilliant_woohoo_power)//卓越芜湖
RandomEventManager.instance.register(supreme_woohoo_power)//至尊芜湖
RandomEventManager.instance.register(ultrafast_dark_woohoo)//超快暗芜湖
RandomEventManager.instance.register(absolute_power_woohoo)//绝对力量
RandomEventManager.instance.register(shadows_woohoo)//万寂逝影
RandomEventManager.instance.register(friendship_magic_woohoo)//友情魔法
RandomEventManager.instance.register(woohoo_staff_v12)//芜湖法杖
RandomEventManager.instance.register(youDontUnderstandWoohoo)//你不懂芜湖
RandomEventManager.instance.register(woohoo_coffee)//芜湖咖啡
RandomEventManager.instance.register(luckyCatEvent)//芜湖小猫
RandomEventManager.instance.register(wohooTakeoffEvent)//芜湖起飞
RandomEventManager.instance.register(tripleWoohooEvent)//三倍芜湖
