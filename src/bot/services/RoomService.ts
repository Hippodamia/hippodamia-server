import {PlayerInfo, Room} from "../../types";



class RoomService {
    private rooms: Room[] = [];

    getRoom(channelId: string) {
        return this.rooms.find(x => x.channelId == channelId)
    }

    createRoom(room: Room) {
        // 检查 channelId 是否重复
        const existingRoom = this.rooms.find(r => r.channelId === room.channelId);
        if (existingRoom) {
            return false;
        }
        this.rooms.push(room);
        return true;
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

    refreshListUI(room:Room){
/*        let card = playerListCard(room.playerList,!room.started ?'加入这场比赛!':'比赛已开始!')
        if(room.playerList.length >= 6 && !room.started){

        }*/
    }
}

const roomService = new RoomService();

export default roomService;
