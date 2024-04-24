//remove
/// <reference path="../../../dist/types.d.ts" />
const { HorseStatus } = require("@hippodamia/core");
const { RandomEventManager } = require("../../../src/components/random-events")
const { HorseUtils } = require("../../../src/utils/HorseUtils")

//remove

/**
 * @typedef {import("../../../src/components/random-events").RandomEvent} RandomEvent
 * @typedef {import("@hippodamia/core").HorseProperty} HorseProperty
 * @typedef {import("@hippodamia/core").Buff<HorseProperty>} Buff
 * @typedef {import("@hippodamia/core").Race} Race
 * @typedef {import("@hippodamia/core").Horse} Horse
 */

/** 
 * @type {RandomEvent}
 */
const civilEng_ch1 = {
    name: 'civilEng.dream',
    alias: '大梦四年 基降狂魔签约国企',
    type: 0, // Positive
    desc: '四年的梦想，最终签约国企!获得10%效果抵抗',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, effect_resistance: horse.Property.effect_resistance + 0.1 };
        race.pushLog(horse, '%player%经过四年的努力，成功签约国企,获得效果抵抗!');
    }
}

/** 
 * @type {RandomEvent}
 */
const civilEng_ch2 = {
    name: 'civilEng.reimbursement',
    alias: '离家千里 路费报销总部报道',
    type: 0, // Positive
    desc: '离家千里，报销路费，报道总部，额外前进1格',
    handler: (race, horse) => {
        horse.move(1)
        race.pushLog(horse, '%player%离家千里，报销路费，成功报道总部,额外前进1格!');
    }
}

/** 
 * @type {RandomEvent}
 */
const civilEng_ch3 = {
    name: 'civilEng.starHotel',
    alias: '星级酒店 我的生活是你的梦',
    type: 0, // Positive
    desc: '生活在星级酒店，这就是你的梦想!获得+10%效果抵抗',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, effect_resistance: horse.Property.effect_resistance + 0.1 };
        race.pushLog(horse, '%player%的生活就像你的梦想，住在星级酒店，幸福感满满,效果抵抗提升!');
    }
}

/**
 * 企业文化内部培训
 * @type {RandomEvent}
 */
const civilEng_ch4 = {
    name: 'civilEng.trainning',
    alias: '深入学习 企业文化内部培训',
    type: 0,
    desc: '深入学习, 企业文化内部培训, 速度+4',
    handler: (race, horse) => {
        // 马蹄铁速度提升效果
        horse.Property = { ...horse.Property, speed: horse.Property.speed + 4 };
        race.pushLog(horse, '%player%在五星级大酒店的礼堂进行了企业文化内部培训,速度提升了！');

    }
}

/**
 * 军训开始，绽放自我
 * @type {RandomEvent}
 */
const civilEng_ch5 = {
    name: 'civilEng.training.begin',
    alias: '军训开始 高谈阔论绽放自我',
    type: 1,
    desc: '军训带来的不仅是体魄上的锻炼，更是心灵上的锻炼,选手获得+10速度和+20%效果抵抗',
    handler: (race, horse) => {
        // 马儿的准度和力量提升效果
        horse.Property = { ...horse.Property, speed: horse.Property.speed + 10, effect_resistance: horse.Property.effect_resistance + 0.2 };
        race.pushLog(horse, '%player%在军训中不断提升自己，获得速度和效果抵抗提升');
    }
}

/**
 * 迎接风宴，小试身手
 * @type {RandomEvent}
 */
const civilEng_ch6 = {
    name: 'civilEng.wind.festival',
    alias: '满心好奇 迎接风宴小试身手',
    type: 0,
    desc: '选手在风宴中引起了大量关注,自信度提升,幸运+1,速度+1',
    handler: (race, horse) => {
        // 马儿魅力值提升效果
        horse.Property = { ...horse.Property, luck: horse.Property.luck + 1, speed: horse.Property.speed + 1 };
        race.pushLog(horse, '%player%在风宴中引起了大量关注,幸运和速度提升!');

    }
}


/**
 * 斗志昂扬 三总五项心神向往
 * @type {RandomEvent}
 */
const civilEng_ch7 = {
    name: 'civilEng.high_morale',
    alias: '斗志昂扬 三总五项心神向往',
    type: 0,
    desc: '选手开始期待三总五项的生活,获得70%效果抵抗!',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, effect_resistance: horse.Property.effect_resistance + 0.7 };
        race.pushLog(horse, '%player%开始期待三总五项的生活,效果抵抗提升!');
    }
}
/**
 * 齐心协力 百日大干争优创先
 * @type {RandomEvent}
 */
const civilEng_ch8 = {
    name: 'civilEng.work_hundred_days',
    alias: '齐心协力 百日大干争优创先',
    type: 2,
    desc: '项目上需要百日大干,争优创先,选手三回合之内速度-10',
    handler: (race, horse) => {
        horse.buffContainer.add({
            name: '百日大干',
            type: 2,
            desc: '百日大干,争优创先,速度-10',
            modifier: (target) => {
                target.speed -= 10;
                return target;
            }
        }, 3)
        race.pushLog(horse, '项目上需要百日大干,争优创先,%player%三回合之内速度减慢!');
    }
}

/**
 * 熬夜打灰 夜半时分初显迷茫
 * @type {RandomEvent}
 */
const civilEng_ch9 = {
    name: 'civilEng.ashing',
    alias: '熬夜打灰 夜半时分初显迷茫',
    type: 2,
    desc: '工地上需要熬夜打灰,选手感觉很迷茫,这真的是他想要的生活吗?',
    handler: (race, horse) => {
        horse.buffContainer.add({
            name: '速度为1',
            type: 2,
            priority: 1,
            desc: '速度始终1',
            modifier: (target) => {
                target.speed = 1;
                return target;
            }
        }, 99)
        race.pushLog(horse, '工地上需要熬夜打灰,%player%感觉很迷茫,这真的是他想要的生活吗?(速度始终为1)');
    }
}

/**
 * 进城采买 灰衣旧鞋矗立街头
 * @type {RandomEvent}
 */
const civilEng_ch10 = {
    name: 'civilEng.city_buy',
    alias: '进城采买 灰衣旧鞋矗立街头',
    type: 2,
    desc: '选手进入城市采买,发现自己的格格不入,速度-4',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, speed: horse.Property.speed - 4 };
        race.pushLog(horse, '%player%进入城市采买,发现自己的格格不入,速度减慢!');
    }
}

/**
 * 进城采买 灰衣旧鞋矗立街头
 * @type {RandomEvent}
 */
const civilEng_ch11 = {
    name: 'civilEng.middle_autumn',
    alias: '八目共赏 中秋佳节不照我圆',
    type: 2,
    desc: '选手在中秋节却没能回家,只能留在工地继续加班,先后移动1格',
    handler: (race, horse) => {
        horse.move(-1)
        race.pushLog(horse, '%player%进入城市采买,发现自己的格格不入,速度减慢!');
    }
}

/**
 * 异地分手 试问苍天谁知我心
 * @type {RandomEvent}
 */
const civilEng_ch12 = {
    name: 'civilEng.breakup',
    alias: '异地分手 试问苍天谁知我心',
    type: 2,
    desc: '选手因为异地分手伤心离开了比赛',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, status: HorseStatus.LEFT };
        race.pushLog(horse, '%player%异地分手 试问苍天谁知我心!十分心痛,直接痛晕过去，退出了比赛!');
    }
}

RandomEventManager.instance.register(civilEng_ch1)
RandomEventManager.instance.register(civilEng_ch2)
RandomEventManager.instance.register(civilEng_ch3)
RandomEventManager.instance.register(civilEng_ch4)
RandomEventManager.instance.register(civilEng_ch5)
RandomEventManager.instance.register(civilEng_ch6)
RandomEventManager.instance.register(civilEng_ch7)
RandomEventManager.instance.register(civilEng_ch8)
RandomEventManager.instance.register(civilEng_ch9)
RandomEventManager.instance.register(civilEng_ch10)
RandomEventManager.instance.register(civilEng_ch11)
RandomEventManager.instance.register(civilEng_ch12)