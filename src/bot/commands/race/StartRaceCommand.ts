/*

import roomService from "../../services/RoomService";
import {playerListCard} from "../../templates/cardTemplateRender";
import clientService from "../../services/ClientService";
import {BaseCommand, BaseSession, CommandFunction} from "kasumi.js";
import RoomService from "../../services/RoomService";
import {Room} from "../../../types";

export function startRaceEvent(channelId: string) {
    const room = roomService.getRoom(channelId)
    if (room && !room.started) {
        room.started = true;
        roomService.refreshListUI(room)

    }
}

async function createRaceProcess(room:Room){
    const race = room.race;

    while (!race.ended){

    }
}

class StartRaceCommand extends BaseCommand {
    name = "start";
    description = "加入本频道的赛场";

    func: CommandFunction<BaseSession, void> = async (session) => {
    }

}

const startRaceCommand = new StartRaceCommand()

export default startRaceCommand
*/
