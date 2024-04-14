//remove
/// <reference path="../../../dist/types.d.ts" />
const {Horse,Race,EffectType} = require("@hippodamia/core")
const {RandomEventManager,RandomEventType} = require("../../../src/components/random-events/index")

//remove

/**
 * @typedef {import("../../../src/components/random-events").RandomEvent} RandomEvent
 * @typedef {import("@hippodamia/core").HorseProperty} HorseProperty
 * @typedef {import("@hippodamia/core").Buff<HorseProperty>} Buff
 */



/**
 * @type {Buff}
 */
const buff_114514 = {
    name: '昏睡红茶',
    type: 1,
    desc: '昏昏欲睡的力量',
    priority: 99,
    modifier: (target, buff) => {
        target.speed = 0;
        return target
    },
    listeners: {
        'buff.end': (ctx) => {
            ctx.race.pushLog(ctx.horse, '%player%从昏睡中醒来');
        }
    }
}


/**
 * 昏睡红茶1.0
 * @type {RandomEvent}
 */
const sleepy_red_tea = {
    name: '14514.red_tea.v1',
    alias: '昏睡红茶1.0',
    type: 1, // Negative
    desc: '选手一饮而尽的红茶让其陷入了昏睡',
    handler: (race, horse) => {

        race.pushLog(horse, '%player%一饮而尽了红茶，立即感到昏昏沉沉，陷入了昏睡。');

        horse.buffContainer.add(buff_114514, 1)
    }
}
/**
 * 改良版昏睡红茶2
 * @type {RandomEvent}
 */
const improved_sleepy_red_tea = {
    name: '14514.red_tea.v2',
    alias: '改良版昏睡红茶2.0',
    type: 1, // Negative
    desc: '选手发现路边有一瓶新款红茶，偷偷喝下，结果顿感不妙，有100%基础概率陷入昏睡，持续2回合。',
    handler: (race, horse) => {

        if (Math.random() < 1.0 * (1 - horse.Property.effect_resistance)) {

            horse.buffContainer.add(buff_114514, 2)

            race.pushLog(horse, '%player%一饮而尽了新款红茶，立即感到昏昏沉沉，陷入了昏睡。');
        } else {
            race.pushLog(horse, '%player%一饮而尽了新款红茶，但没有陷入昏睡。');
        }

    }
}
/**
 * 无限红茶？
 * @type {RandomEvent}
 */
const infinite_red_tea = {
    name: '114514.red_tea.infinity',
    alias: '无限红茶?',
    type: 1, // Negative
    desc: '为什么这杯昏睡红茶喝不完！原来是SCP-114514无限红茶！选手陷入持续999回合的眩晕状态。',
    handler: (race, horse) => {

        race.pushLog(horse, '%player%发觉这杯红茶怎么也喝不完，原来这是无限红茶！他立即陷入了眩晕状态。');

        horse.buffContainer.add(buff_114514, 999)

    }
}
/**
 * 哼哼啊啊啊
 * @type {RandomEvent}
 */
const yelling_on_floor = {
    name: 'player.yelling',
    alias: '哼哼啊啊啊',
    type: 1, // Negative
    desc: '选手躺在地上，大声叫嚷，吵得其他选手也无法专心比赛',
    handler: (race, horse) => {
        race.pushLog(horse, '%player%躺在地上大声叫嚷，使其他选手无法专心比赛。');
        let all_horses = race.getOthers([horse])
        all_horses.forEach(other => {
            // Excluding the yelling horse
            race.pushLog(horse, `因为%player%的叫嚷，${other.raw_display}的速度下降了`);
            other.buffContainer.add({
                name: '哼哼啊啊啊',
                type: 1,
                desc: '被吵到的力量',
                priority: 2,
                modifier: (target, buff) => {
                    target.speed -= 10;
                    return target
                }
            }, 2)

        })
    }
}

/**
 * 哼哼啊啊啊
 * @type {RandomEvent}
 */
const sleepy_tea_bomb = {
    name: 'xianbei.red_tea_bomb',
    alias: '仙贝红茶炸弹递送员',
    type: 1, // Negative
    desc: '选手发明出了可以必定昏睡的红茶炸弹，穿上小马快递服，每回合随机给一个选手投掷红茶炸弹，必定陷入1回合昏睡状态。',
    handler: (race, horse) => {

        /**
         * @type {Buff} 
         */
        const conveyer = {
            name: '仙贝红茶炸弹递送员',
            type: 0,
            desc: '随机给一个选手投掷红茶炸弹',
            priority: 1,
            listeners: {
                'horse.round.start': (race,horse) => {
                    const others = race.getOthers([horse]);
                    const target = others[Math.floor(Math.random() * others.length)]

                    race.pushLog(horse, `%player%向${target.raw_display}投掷了一颗红茶炸弹，使其入了昏睡状态`);
                }
            }
        }

        horse.buffContainer.add(conveyer, 4);

        
    }
};

RandomEventManager.instance.register(sleepy_red_tea)//昏睡红茶1.0
RandomEventManager.instance.register(improved_sleepy_red_tea)//昏睡红茶2.0
RandomEventManager.instance.register(infinite_red_tea)//infinite_red_tea
RandomEventManager.instance.register(yelling_on_floor)//哼哼啊啊啊
RandomEventManager.instance.register(sleepy_tea_bomb)//仙贝红茶炸弹递送员
