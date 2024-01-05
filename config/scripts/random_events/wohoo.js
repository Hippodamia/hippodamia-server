/**
 * @typedef {Object} RandomEvent
 * @property {string} name - 唯一name使用系列.xxx来确定
 * @property {string} alias - 别名，用于中文的表示
 * @property {number} type - 类型
 * @property {string} desc - 简化的描述
 * @property {(race: Race, horse: Horse) => void} handler - 处理函数
 */
/**
 * @typedef {Object} HorseProperty
 * @property {number} speed
 * @property {number} effect_resistance
 * @property {number} luck
 * @property {number} status
 * @property {string} display
 */

/**
 * @typedef {Object} BuffBase
 * @property {string} name
 * @property {EffectType} type
 * @property {string} desc
 * @property {string} [doc]
 * @property {number} [priority]
 */

/**
 * @typedef {Object} Buff
 * @property {{ [key: string]: (...args: any[]) => void }} [listeners]
 * @property {BuffBase} [listener]
 * @property {BuffBase} [modifier]
 * @template T
 */
/**
 * woohoo buff
 * @type {Buff}
 */
const wohoo_buff ={
    name: 'WOO-HOO之力',
    type: 0,
    desc: 'WOO HOO! 起飞! 小幅度增加速度、幸运与效果抵抗',
    modifier: (target,buff) => {
        //提升选手1点速度，5%幸运和5%效果抵抗
        target.speed+=1
        target.luck+=0.05
        target.effect_resistance+=0.05

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
        horse.buffContainer.add(wohoo_buff, 99,1)
        horse.move(1);
        race.pushLog(horse, '%player%被神奇的力量包裹，直接前进了1格');
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
        horse.buffContainer.add(wohoo_buff, 99,1)
        horse.move(2);
        race.pushLog(horse, '%player%被金色的光芒包裹，直接前进了2格');
    }
}


const brilliant_woohoo_power = {
    name: 'woohoo.power.brilliant',
    alias: '璀璨芜湖力量',
    type: 0,
    desc: '璀璨的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99,1)
        horse.move(3);
        race.pushLog(horse, '%player%被璀璨的五彩斑斓之光包裹，直接前进了3格');
    }
}

const supreme_woohoo_power = {
    name: 'woohoo.power.supreme',
    alias: '至尊芜湖力量',
    type: 0,
    desc: '至尊的芜湖力量让玩家额外前进',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99,1)
        horse.move(4);
        race.pushLog(horse, '%player%被难以言表的至尊力量包裹，直接越过了4格');
    }
}

const ultrafast_dark_woohoo = {
    name: 'woohoo.power.ultrafast_dark',
    alias: '超速黑暗芜湖',
    type: 2, // Neutral
    desc: '黑色的死亡笼罩了玩家，但也带来神奇的力量',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99,1)

        horse.move(2);
        race.pushLog(horse, '%player%被黑色的死亡笼罩，并获得了邪恶但强大的力量。');

        horse.buffContainer.add({
            name: '超速黑暗芜湖',
            type: 2,
            desc: '死亡的力量?',
            priority: 1,
            modifier: (target,buff) => {
                target.speed+=10;
                target.display = `<吞噬:${buff.remains}>` + target.display
                return target
            },
            listeners:{
                'buff.end':(ctx)=>{
                    //ctx.horse.Property = {...ctx.horse.Property,status:1}
                    console.debug('选手死亡')
                }
            }
        },3)
    }
}

const absolute_power_woohoo = {
    name: 'woohoo.power.absolute',
    alias: '绝对力量芜湖',
    type: 0, // Positive
    desc: '绝对的力量赋予了玩家无可比拟的速度',
    handler: (race, horse) => {
        horse.buffContainer.add(wohoo_buff, 99,1)
        horse.move(horse.track.segments.length); // move to the end of track
        race.pushLog(horse, '%player%被绝对的力量笼罩，一踏出便到达了赛道的终点!');
    }
}

HippodamiaRandomEventManager.register(normal_woohoo_power)
HippodamiaRandomEventManager.register(gold_woohoo_power)
HippodamiaRandomEventManager.register(brilliant_woohoo_power)
HippodamiaRandomEventManager.register(supreme_woohoo_power)
HippodamiaRandomEventManager.register(ultrafast_dark_woohoo)
HippodamiaRandomEventManager.register(absolute_power_woohoo)
