import roomService from "../../services/RoomService";
import {Race} from "../../../core/Race";
import {playerJoinedTemplate, raceCreatedTemplate} from "../../templates/raceTemplate";
import {randomUser} from "@hippodamia/bot";
import {CommandRouter} from "../../../types";

export const createRace: CommandRouter = async (ctx) => {
    const cid = ctx.channel.id;
    if (!roomService.getRoom(cid)) {
        const race = new Race({speed: 10})
        roomService.createRoom({
            channelId: ctx.channel.id,
            race,
            playerList: [],
        })
        ctx.reply(raceCreatedTemplate())
    }
}

export const joinRace = async (ctx) => {
    const cid = ctx.channel.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid).race;
        const display = ctx.args.nick ?? '🐎';
        if (race.join(ctx.user, display))
            ctx.reply(playerJoinedTemplate(display, race.players.length))
        else
            ctx.reply("嘟嘟嘟...已经加入啦")

    }
}

export const addFakePlayer = async (ctx) => {
    const cid = ctx.channel.id;
    const count = Number(ctx.args.count) ?? 1;

    let added = 0;
    for (let i = 0; i < count; i++) {
        if (!roomService.getRoom(cid)) {
            const race = new Race({speed: 10})
            roomService.createRoom({
                channelId: ctx.channel.id,
                race,
                playerList: []
            })
        }

        const race = roomService.getRoom(cid).race;
        if (race.join(randomUser(), '🐎')) {
            added++;
        }
    }
    ctx.reply(`fake user added :${added}`)
}

export const startRace = async (ctx) => {
    const cid = ctx.channel.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid).race;
        if (race.players.length <= 3) {
            ctx.reply("😮比赛人数不够!")
            return;
        }
        if (!race.isStarted) {
            race.start()
            //timer task
            new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    //定时发送赛场，分为日志和选手位置
                    ctx.reply(
                        [
                            ...race.logs,
                            '---',
                            ...race.tracks.map(
                                track => {
                                    let line = '.'.repeat(track.segments.length).split('');
                                    track.horses.forEach(horse => {
                                        line[track.segments.length - horse.step] = horse.display
                                    })
                                    return line.join('');
                                }
                            )
                        ].join('\n')
                    )
                    if (race.ended){
                        resolve(true)
                        clearInterval(interval)
                    }
                    race.next()
                }, 600) //todo 修改到慢速
            })
        } else
            ctx.reply("😮比赛似乎已经开始咯")

    }
}
