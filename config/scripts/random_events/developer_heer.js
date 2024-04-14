//remove
/// <reference path="../../../dist/types.d.ts" />
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
const heer_intrusion = {
    name: 'heer.intrusion',
    alias: '赫尔乱入比赛',
    type: 0, // Positive
    desc: '赫尔使用神秘的力量加速了随机几位位选手的速度和位置',
    handler: (race, horse) => {
        race.pushLog(horse, '%player%召唤了赫尔!');
        let affected_horses = HorseUtils.getRandomHorsesByCount(race, Math.floor(Math.random() * 3) + 1)
        affected_horses.forEach(horse => {
            horse.Property = { ...horse.Property, speed: horse.Property.speed + 3 };
            horse.move(+2);
            race.pushLog(horse, `${horse.display}被赫尔的神秘力量影响，速度和位置都有所提升!`);
        });
    }
}

/** 
 * @type {RandomEvent}
 */
const heer_touch = {
    name: 'heer.touch',
    alias: '赫尔随手一点',
    type: 2, // Neutral
    desc: '赫尔随手一点,选手被修改为速度10',
    handler: (race, horse) => {
        horse.Property = { ...horse.Property, speed: 10 };
        race.pushLog(horse, '%player%被赫尔的力量影响，速度被修改为10。');
    }
}

/** 
 * @type {RandomEvent}
 */
const heer_dizziness = {
    name: 'heer.dizziness',
    alias: '赫尔赋予眩晕Buff',
    type: 1, // Negative
    desc: '赫尔赋予触发事件选手眩晕Buff',
    handler: (race, horse) => {
        race.pushLog(horse, '%player%被赫尔赋予了眩晕Buff，感到头晕目眩。');

        horse.buffContainer.add({
            name: '赫尔眩晕Buff',
            type: 1,
            desc: '眩晕的力量',
            priority: 99,
            modifier: (target, buff) => {
                target.speed = 0
                return target
            },
            listeners: {
                'buff.end': (ctx) => {
                    race.pushLog(horse, '%player%的眩晕Buff消失了，恢复了正常。');
                }
            }
        }, 2)
    }
}


/** 
 * @type {RandomEvent}
 */
const heer_prank = {
    name: 'heer.prank',
    alias: '赫尔的恶作剧',
    type: 2, // Neutral
    desc: '赫尔想要调戏一下选手,强行改变了选手和随机一位选手的赛道',
    handler: (race, horse) => {

        const { horse: randomHorse, index: track_num } = HorseUtils.getRandomHorseNotSelf(race, horse);

        const firstHorse = race.getHorses()[0];

        race.tracks[0].horses = [randomHorse];
        race.tracks[track_num].horses = [firstHorse];

        race.pushLog(firstHorse, `%player%和${randomHorse.display}的赛道被赫尔进行了调换!`);

    }
}

/** 
 * @type {RandomEvent}
 */
const heer_twist_everything = {
    name: 'heer.twist_everything',
    alias: '扭转万象!',
    type: 2, // Neutral
    desc: '扭转万象，所有选手的位置随机打乱',
    handler: (race, horse) => {

        race.pushLog(horse, '赫尔因为抽不出识宝，气愤的大喊，我将!!扭转万象!!(所有选手位置随机改变)')

        race.getHorses().forEach(horse => {
            horse.step = Math.floor(Math.random() * race.config.length)
        });
    }
}

/** 
 * @type {RandomEvent}
 */
const heer_twist_everything_good = {
    name: 'heer.twist_everything',
    alias: '扭转一切!',
    type: 0, // Positive
    desc: '赫尔扭转一切不完美的事物，变成他想要的样子',
    handler: (race, horse) => {

        race.pushLog(horse, '赫尔抽出了识宝，开心的大喊，我将!!扭转万象!!(所有选手位置强制+3)')
        race.getHorses().forEach(horse => {
            horse.step += 3
        });
    }
}

RandomEventManager.instance.register(heer_intrusion)
RandomEventManager.instance.register(heer_touch)
RandomEventManager.instance.register(heer_dizziness)
RandomEventManager.instance.register(heer_prank)
RandomEventManager.instance.register(heer_twist_everything)