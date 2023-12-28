/*
import {BaseCommand, CommandFunction, BaseSession, Card} from 'kasumi.js';
import {PlayerInfo} from "../../../types";
import roomService from "../../services/RoomService";

//...


export function joinRaceEvent(channelId: string, player: PlayerInfo) {
    console.log(`${player.userNickName}尝试加入${channelId}频道的赛场!`)
    try {
        roomService.addPlayer(channelId, player)

        const room = roomService.getRoom(channelId)!;
        roomService.refreshListUI(room)

    } catch (e) {
        throw e;
    }

}

class JoinRaceCommand extends BaseCommand {
    name = "join";
    description = "加入本频道的赛场";

    func: CommandFunction<BaseSession, void> = async (session) => {
    }



}

const joinRaceCommand = new JoinRaceCommand();
export default joinRaceCommand
*/
