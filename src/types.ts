import {Race} from "./core/Race";
import {Context} from "@hippodamia/bot";

export interface PlayerInfo{
    userId:string,
    userName?:string,
    userNickName?:string,
}

/**
 * 房间
 * 与平台的频道耦合，是针对一个频道（子频道）来说的唯一索引区域。
 */
export interface Room {
    channelId: string,
    playerList: PlayerInfo[],
    race: Race
    started?:boolean
}

/**
 * 路由
 */
export type CommandRouter = (ctx: Context) => void|Promise<void>


export interface Shop{
    name:string,
    description:string,
    items:ShopItem[]
}

export interface ShopItem{
    name:string,
    description:string,
    price:number,
    discount?:number,
    type?:'global_limit' | 'user_limit' |'no_limit',
    limit?:number
}


