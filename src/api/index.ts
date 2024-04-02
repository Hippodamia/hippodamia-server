import fastify from "fastify";
import {UserDataService} from "../data/userDataService";
import groups_settings from "./groups_settings";

const app = fastify();

app.get<{ Params: { user: string } }>('/api/coins/<user>', async (request, reply) => {
    const _user = request.params.user
    const info = await new UserDataService(_user).getUserInfo();

    const {id, nick, qqId, coins} = info

    return {user: {id, nick, qqId}, coins}
})

app.put<{ Params: { user: string } }>('/api/coins/<user>/<amount>', async (request, reply) => {
    const _user = request.params.user
    const u = new UserDataService(_user);
})

app.register(groups_settings)


async function startListen() {
    console.log('[Hippodamia Server]服务启动于127.0.0.1:8893')
    await app.listen({port: 8893, host: '127.0.0.1'})
}

export {startListen}
