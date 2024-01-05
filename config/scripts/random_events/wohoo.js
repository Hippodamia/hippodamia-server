/**
 * @typedef {Object} RandomEvent
 * @property {string} name - 唯一name使用系列.xxx来确定
 * @property {string} alias - 别名，用于中文的表示
 * @property {number} type - 类型
 * @property {string} desc - 简化的描述
 * @property {(race: Race, horse: Horse) => void} handler - 处理函数
 */

const wohoo_buff ={
    name: 'WOO-HOO之力',
    type: 0,
    desc: 'WOO HOO! 起飞! 小幅度增加速度、幸运与效果抵抗',
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
        horse.move(1);
        race.pushLog(horse, '%player%被神奇的力量包裹，直接前进了1格');
    }
}


/**
 *
 * @type {RandomEvent}
 */
const gold_woohoo_power = {
    name: 'woohoo.power.gold',
    alias: '黄金芜湖力量',
    type: 0,
    desc: '普通的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.move(2);
        race.pushLog(horse, '%player%被金色的光芒包裹，直接前进了2格');
    }
}

HippodamiaRandomEventManager.register(normal_woohoo_power)
HippodamiaRandomEventManager.register(gold_woohoo_power)
