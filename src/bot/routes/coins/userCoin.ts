import {UserDataService} from "../../services/userDataService";
import {CommandRouter} from "../../../types";

export const queryUserCoins: CommandRouter =
    async (ctx) => {
        const usr = new UserDataService(ctx.user.id)
        ctx.reply(
            [
                '😊嗨，好久不见!',
                `你当前拥有🍭 ${await usr.getUserCoins()} 小马积分!`,
                '😉你可以通过这些方式来获取积分:',
                '- 参与比赛', '- 每日签到',
                '- 雷普赫尔'
            ].join('\n'))
    }
