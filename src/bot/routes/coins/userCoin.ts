import { Hippodamia } from "@/hippodamia";
import { UserDataService } from "../../../data/userDataService";
import { CommandRouter } from "../../../types";

export const queryUserCoins: CommandRouter =
    async (ctx) => {
        //  获取用户信息
        const usr = new UserDataService(ctx.user.id)
        ctx.reply(Hippodamia.instance.i18n['bot.command.query_coins'].replace('%coins%', (await usr.getUserCoins()).toString()))
    }
