import {Race} from "./core/Race";
import {Context} from "@hippodamia/bot";

export interface PlayerInfo{
    userId:string,
    userName?:string,
    userNickName?:string,
}

export interface Room {
    channelId: string,
    playerList: PlayerInfo[],
    race: Race
    started?:boolean
}
export type CommandRouter = (ctx: Context) => void|Promise<void>
