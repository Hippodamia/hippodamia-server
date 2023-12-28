import fastify from "fastify";
import {UserDataService} from "../bot/services/userDataService";

const app = fastify();

app.get<{Params: {user: string}}>('/api/coins/<user>', async (request, reply) => {
    const _user = request.params.user
    const info =  await new UserDataService(_user) .getUserInfo();
    return {user:{id:info.id,nick:info.nick,qq:info.qqId},coins:info.coins}
})

app.put<{Params: {user: string}}>('/api/coins/<user>/<amount>', async (request, reply) => {
    const _user = request.params.user
    const u = new UserDataService(_user);
})



async  function startListen(){
    console.log('runned')
    await app.listen({port: 8893, host: '127.0.0.1'})
}
export { startListen }
