import { GroupSettingsManager } from "../../managers/GroupSettingsManager";
import { PlayerInfo, Room } from "../../types";


class RoomService {
    private rooms: Room[] = [];
    private allow_time_room = new Map<string, number>();

    getRoom(channelId: string) {
        return this.rooms.find(x => x.channelId == channelId)
    }

    createRoom(room: Room):boolean {
        // 检查 channelId 是否重复
        const existingRoom = this.rooms.find(r => r.channelId === room.channelId);
        if (existingRoom && !existingRoom.race.ended) {
            throw "existing room";
        } else if (Date.now() < (this.allow_time_room.get(room.channelId) ?? 0)) {
            throw "cd limit";
        }
        else if (existingRoom && existingRoom.race.ended) {
            this.removeRoom(existingRoom.channelId)
            console.log('[RoomService]删除了房间')
        }
        this.rooms.push(room);
        return true;
    }

    public removeRoom(channelId: string) {
        const index = this.rooms.findIndex(r => r.channelId === channelId);
        if (index !== -1) {
            this.rooms.splice(index, 1);
            this.allow_time_room.set(channelId, Date.now() + (GroupSettingsManager.instance.get(channelId)?.cd ?? 0));
        }
    }

    addPlayer(roomId: string, player: PlayerInfo) {
        const room = this.rooms.find(r => r.channelId === roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        // 检查 player 是否重复
        const existingPlayer = room.playerList.find(p => p.userId === player.userId);
        if (existingPlayer) {
            throw new Error('Player already exists in room');
        }
        room.playerList.push(player);
    }

    refreshListUI(room: Room) {
        /*        let card = playerListCard(room.playerList,!room.started ?'加入这场比赛!':'比赛已开始!')
                if(room.playerList.length >= 6 && !room.started){

                }*/
    }

}

const roomService = new RoomService();

export default roomService;
