import roomService from "@/bot/services/RoomService";
import { Race } from "@hippodamia/core";
import { playerJoinedTemplate, raceCreatedTemplate } from "@/bot/templates/raceTemplate";
import { randomUser } from "@hippodamia/bot";
import { CommandRouter } from "@/types";
import { randomEmoji } from "@/utils";
import { Hippodamia } from "@/hippodamia";
import { GroupSettingsManager } from "@/managers/GroupSettingsManager";


const i18n = Hippodamia.instance.i18n

export const createRace: CommandRouter = async (ctx) => {

    let mode = ctx.args!.mode;

    //根据别名以及key获取直接mode，判断本群是否可以使用这个模式
    const group_modes = GroupSettingsManager.instance.getModes(ctx.channel!.id)
    const mode_names = [...Object.keys(group_modes), ...Object.values(group_modes).map(x => x.alias ?? []).flat(1)]

    if (mode_names.includes(mode)) {
        for (const key in group_modes)
            if (key == mode || group_modes[key].alias?.includes(mode))
                mode = key as any;
    } else {

        const mode_lists = Object.keys(group_modes).map(key =>
            `- ${key}(${(group_modes[key].alias?.join('|') ?? '')})`
        )

        console.log(mode_lists)

        ctx.reply(['本群当前支持以下模式:', ...mode_lists, '使用 /创建赛马 模式 来创建对应模式的赛场!(例如 /创建赛马 随机事件)'].join('\n'))
        return;
    }

    const cfg = group_modes[mode]

    // TODO 允许配置自定义赛场基础属性


    //将自定义mode根据base转为基础mode(random/pure)
    while (!['pure', 'random'].includes(mode)) {
        const base = group_modes[mode].base_mode
        if (!base) {
            ctx.reply(i18n['race.create.invalid_mode'])
            return;
        }
        mode = base;
    }



    // todo 传入独立配置对象?
    const race = new Race({ speed: 10, length: 20, mode: mode as any })
    try {
        roomService.createRoom({
            channelId: ctx.channel!.id,
            race,
            playerList: [],
        })
        ctx.reply(raceCreatedTemplate(mode))
    } catch (e) {
        if (e === 'cd limit') {
            ctx.reply('游戏冷却未结束')
        }
        if (e === 'existing room') {
            ctx.reply(i18n['race.pre.exist_room'])
        }
    }


}

/** 加入命令的路由 */
export const joinRace: CommandRouter = async (ctx) => {
    const cid = ctx.channel!.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid)!.race;
        const display = ctx.args!.nick ?? '🐎';
        if (race.join(ctx.user, display))
            ctx.reply(playerJoinedTemplate(display, race.players.length))
        else
            ctx.reply(i18n['race.join.already_joined'])

    }
}

/** fake player的路由 */
export const addFakePlayer: CommandRouter = async (ctx) => {
    const cid = ctx.channel!.id;
    const count = Number(ctx.args!.count) ?? 1;

    let added = 0;


    for (let i = 0; i < count; i++) {
        if (!roomService.getRoom(cid)) {
            ctx.reply(i18n['race.pre.no_room'])
            return;
        }

        const race = roomService.getRoom(cid)!.race;
        if (race.join(randomUser(), randomEmoji())) {
            added++;
        }
    }
    ctx.reply(`已添加虚拟选手:${added}位`)
}

/** 开始命令的路由 */
export const startRace: CommandRouter = async (ctx) => {
    const cid = ctx.channel!.id;
    if (roomService.getRoom(cid)) {
        const race = roomService.getRoom(cid)!.race;
        if (race.players.length <= 3) {
            ctx.reply(i18n['race.start.not_enough_player'])
            return;
        }
        if (!race.isStarted) {
            race.start()
            ctx.reply(renderRace(race));
            //timer task
            new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    try {
                        race.next()
                    } catch (e) {
                        ctx.reply(i18n['race.task.error'].replace('%error%', (e as Error).message))
                        ctx.reply('race ended and room removed')
                        roomService.removeRoom(cid)
                        resolve(true)
                        clearInterval(interval)
                    }
                    //定时发送赛场，使用渲染函数
                    ctx.reply(renderRace(race))
                    if (race.ended) {
                        //generate message for the player list of winners and ranks

                        const result = race.getRaceResult();

                        let strs: string[] = [];
                        strs.push(i18n['race.end.ranking.winners.title'])
                        result.winners.forEach(winner => {
                            strs.push(`- ${winner.display}(@${winner.user.name})`)
                        })
                        strs.push(i18n['race.end.ranking.others.title'])
                        result.ranks.filter(x => !result.winners.includes(x)).forEach(player => {
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
            ctx.reply("")

    } else {
        ctx.reply(i18n['race.pre.no_room'])
    }
}

//todo 增加多平台不同的渲染方式
/** 渲染当前比赛的文本 */ 
function renderRace(race: Race): string {
    return [
        ...race.logs.map(x => x.content),
        '---',
        ...race.tracks.map(
            track => {
                let line = '.'.repeat(track.segments.length).split('');
                track.horses.forEach(horse => {
                    line[track.segments.length - horse.step] = horse.display
                })

                let moved = track.horses[0].last_moved ?? 0;

                return `[${moved < 0 ? '-' : '+'}${moved}]` + line.join('');
            }
        )
    ].join('\n')
}
