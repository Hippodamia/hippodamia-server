import roomService from "../../services/RoomService";
import {Race} from "../../../core/Race";
import {playerJoinedTemplate, raceCreatedTemplate} from "../../templates/raceTemplate";
import {randomUser} from "@hippodamia/bot";
import {CommandRouter} from "../../../types";
import { randomEmoji } from "../../../utils";
import { i18n } from "../../../hippodamia";

export const createRace: CommandRouter = async (ctx) => {
    const cid = ctx.channel.id;
    if (!roomService.getRoom(cid)) {
        const race = new Race({speed: 10,length:20,mode:ctx.args.mode as any})
        roomService.createRoom({
            channelId: ctx.channel.id,
            race,
            playerList: [],
        })
        ctx.reply(raceCreatedTemplate(ctx.args.mode))
    }
}

export const joinRace: CommandRouter = async (ctx) => {
    const cid = ctx.channel.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid).race;
        const display = ctx.args.nick ?? '🐎';
        if (race.join(ctx.user, display))
            ctx.reply(playerJoinedTemplate(display, race.players.length))
        else
            ctx.reply(i18n['race.join.already_joined'])

    }
}

export const addFakePlayer = async (ctx) => {
    const cid = ctx.channel.id;
    const count = Number(ctx.args.count) ?? 1;

    let added = 0;

    

    for (let i = 0; i < count; i++) {
        if (!roomService.getRoom(cid)) {
            ctx.reply(i18n['race.pre.no_room'])
            return;
        }

        const race = roomService.getRoom(cid).race;
        if (race.join(randomUser(), randomEmoji())) {
            added++;
        }
    }
    ctx.reply(`已添加虚拟选手:${added}位`)
}

export const startRace = async (ctx) => {
    const cid = ctx.channel.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid).race;
        if (race.players.length <= 3) {
            ctx.reply(i18n['race.start.not_enough_player'])
            return;
        }
        if (!race.isStarted) {
            race.start()
            //timer task
            new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    try{
                        race.next()
                    }catch (e) {
                        ctx.reply(i18n['race.task.error'].replace('%error%',e))
                        ctx.reply('race ended and room removed')
                        roomService.removeRoom(cid)
                        resolve(true)
                        clearInterval(interval)
                    }
                    //定时发送赛场，使用渲染函数
                    ctx.reply(renderRace(race))
                    if (race.ended){
                        //generate message for the player list of winners and ranks

                        const result = race.getRaceResult();

                        let strs = [];
                        strs.push(i18n['race.end.ranking.winners.title'])
                        result.winners.forEach(winner=>{
                            strs.push(`- ${winner.display}(@${winner.user.name})`)
                        })
                        strs.push(i18n['race.end.ranking.others.title'])
                        result.ranks.filter(x=>!result.winners.includes(x)).forEach(player=>{
                            strs.push(`- ${player.display}(@${player.user.name})`)
                        })

                        ctx.reply(strs.join('\n'))
                        roomService.removeRoom(cid)
                        resolve(true)
                        clearInterval(interval)
                    }
                }, 9000) //todo 修改到慢速
            })
        } else
            ctx.reply("😮比赛似乎已经开始咯")

    }else{
        ctx.reply(i18n['race.pre.no_room'])
    }
}

function renderRace(race:Race):string{
    return [
        ...race.logs.map(x=>x.content),
        '---',
        ...race.tracks.map(
            track => {
                let line = '.'.repeat(track.segments.length).split('');
                track.horses.forEach(horse => {
                    line[track.segments.length - horse.step] = horse.display
                })

                let moved = track.horses[0].last_moved ?? 0;

                return `[${moved<0?'-':'+'}${moved}]` + line.join('');
            }
        )
    ].join('\n')
}
