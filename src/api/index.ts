import fastify from "fastify";
import { UserDataService } from "../data/userDataService";
import groups_settings from "./groups_settings";

const app = fastify({ logger: {
    transport:{
        target:'pino-pretty'
    }
} });

app.get<{ Params: { user: string } }>('/api/coins/<user>', async (request, reply) => {
    const _user = request.params.user
    const info = await new UserDataService(_user).getUserInfo();

    if (!info) {
        reply.code(404).send({ error: '用户不存在' })
        return
    }
    const { id, nick, qqId, coins } = info

    return { user: { id, nick, qqId }, coins }
})

app.put<{ Params: { user: string } }>('/api/coins/<user>/<amount>', async (request, reply) => {
    const _user = request.params.user
    const u = new UserDataService(_user);
})

app.register(groups_settings)


async function startListen() {
    //app.log.info('[Hippodamia Server] 服务启动于127.0.0.1:8893')
    await app.listen({ port: 8893, host: '127.0.0.1' })
}

export { startListen }
