import { Race } from "@hippodamia/core";
import { Context } from "@hippodamia/bot";

export interface PlayerInfo {
    userId: string,
    userName?: string,
    userNickName?: string,
}

/**
 * 房间
 * 与平台的频道耦合，是针对一个频道（子频道）来说的唯一索引区域。
 */
export interface Room {
    channelId: string,
    playerList: PlayerInfo[],
    race: Race
    started?: boolean
}

/**
 * 路由
 */
export type CommandRouter = (ctx: Context) => void | Promise<void>


export interface Shop {
    name: string,
    description: string,
    items: ShopItem[]
}

export interface ShopItem {
    name: string,
    description: string,
    price: number,
    discount?: number,
    type?: 'global_limit' | 'user_limit' | 'no_limit',
    limit?: number
}

export type GameModeSetting = Partial<{
    /** 速度: 0-20 */
    speed: number;
    /** 最少玩家数量 */
    min_player: number;
    /** 最多玩家数量 */
    max_player: number;
    /** 赛道长度 */
    length: number;
    /** 幸运 */
    luck: number;
    /** 效果抵抗 */
    effect_resistance: number;
    /** 内容排除 */
    exclude: string[];
    /** 前置模式 */
    base_mode: string,
    /** 消息间隔 */
    interval: number,
    /** 别名 */ 
    alias: string[]
}>

export type GroupSetting = Partial<{
    enable: boolean;
    admins: string[];
    cd: number;
    game: {
        [key: string]: GameModeSetting;
    };
}>;
