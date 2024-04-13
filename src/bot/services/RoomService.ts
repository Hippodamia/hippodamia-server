import { GroupSettingsManager } from "../../managers/GroupSettingsManager";
import { PlayerInfo, Room } from "../../types";


class RoomService {
    private rooms: Room[] = [];
    private allow_time_room = new Map<string, number>();

    /**
     * 获取一个房间对象 
     * @param channelId 
     */
    public getRoom(channelId: string) {
        const room = this.rooms.find(x => x.channelId == channelId)
        return room;
    }

    /**
     * 新增一个房间，如果本群组存在这个房间，则会异常
     * @param room 房间对象(信息)
     * @returns 
     */
    public createRoom(room: Room):boolean {
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

    /**
     * 删除指定群组的房间，并为这个群组设置冷却时常
     * 冷却时常取决于群组设置中的 cd 字段
     * @param channelId 群组ID
     */
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
