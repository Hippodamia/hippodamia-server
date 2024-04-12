import { Adapter, Bot } from "@hippodamia/bot";
import { getTextOfJSDocComment } from "typescript";
import { Client, GroupMessage, Message, PrivateMessage } from "onebot-client";

export type OneBotConfig =
    { mode: 'http', port: number, secret?: string, api: string }
    | { mode: 'ws', url: string, secret?: string, bot: string }
    | { mode: 'null' }

export class OneBotAdapter implements Adapter {

    info: { version: string; name: string; desc: string; } = {
        version: "0.0.1",
        name: "onebot11",
        desc: "OneBot v11 Adapter for Hippodamia Bot Framework"
    }

    api: {
        sendGroupMessage: (group_id: string, message: string, auto_escape?: boolean) => Promise<number>,
        sendPrivateMessage: (user_id: string, message: string, auto_escape?: boolean) => Promise<number>,
    }

    bot!: Bot;
    config: OneBotConfig;

    client?: Client

    private getApiUrl() {
        if (this.config.mode === 'http') {
            return this.config.api;
        }
        return ''
    }

    private http_apis: OneBotAdapter['api'] = {
        sendGroupMessage: async (group_id, message, auto_escape = false): Promise<number> => {
            const url = `${this.getApiUrl()}/send_group_msg`
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_id: Number(group_id),
                    message,
                    auto_escape
                })
            })
            return Number((await resp.json())['message_id'])
        },
        sendPrivateMessage: async (user_id, message, auto_escape = false): Promise<number> => {
            const url = `${this.getApiUrl()}/send_private_msg`
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: Number(user_id),
                    message,
                    auto_escape
                })
            })
            return (await resp.json())['message_id']
        }
    }

    private ws_apis: OneBotAdapter['api'] = {
        sendGroupMessage: async(group_id, message, auto_escape) => {
            await this.client?.sendGroupMsg(Number(group_id), message)
            return 1
        },
        sendPrivateMessage : async (user_id, message, auto_escape) =>{
            await this.client?.sendPrivateMsg(Number(user_id), message)
            return 1
        }
    }

    // 构造传入配置对象，根据配置对象初始化API方法表
    constructor(config: OneBotConfig) {
        this.config = config
        //根据配置文件对应不同的消息收发方式

        switch (config.mode) {
            case 'http':
                this.api = this.http_apis
                break
            case 'ws':
                this.api = this.ws_apis
                break;
            case 'null':
                this.api = {
                    sendGroupMessage: async (group_id, message, auto_escape): Promise<number> => {
                        return 1
                    },
                    sendPrivateMessage: async (user_id, message, auto_escape): Promise<number> => {
                        return 1
                    }
                }
        }
    }

    send(content: string | string[], target: { channel?: string | undefined; user?: string | undefined; }): void {
        let msg = ""
        if (content instanceof Array)
            msg = content.join("\n")
        else
            msg = content

        this.bot.logger.debug(`[OneBotAdapter] Sending message to ${target.channel || target.user}: ${msg}`)

        if (this.config.mode == 'http') {
            if (target.channel)
                this.api.sendGroupMessage(target.channel, msg)
            else if (target.user)
                this.api.sendPrivateMessage(target.user, msg)
        }
    }

    /**
     * 初始化bot与消息处理器
     * @param bot 
     * @returns 
     */
    init?(bot: Bot): void {
        this.bot = bot;

        if (this.config.mode === 'null') return

        if (this.config.mode === 'http') {

            Bun.serve({
                fetch: async (req) => {
                    const url = new URL(req.url);
                    if (url.pathname === "/onebot" && req.method === "POST") {

                        const body = await req.json();
                        this.bot.logger.debug(`[OneBotAdapter] Received HTTP request: ${req.method} ${req.url}`)
                        this.bot.logger.debug(body)

                        return new Response(this.handler['message'](body));

                    }
                    return new Response("404!");
                },
                port: this.config.port,
            });

            this.bot.logger.info(`[OneBotAdapter] HTTP listening on port ${this.config.port}`)
        }

        if (this.config.mode === 'ws') {
            //初始化正向ws模式的onebot适配器
            this.client = new Client(Number(this.config.bot), this.config.url)
            this.client.start()

            //监听消息事件
            this.client.on('message', this.handler['message'])

            this.bot.logger.info(`[OneBotAdapter] WS Client started`)

        }

    }

    handler = {
        'message': (event: Message) => {
            if (event.message_type === 'private') {
                const { user_id, raw_message } = event as PrivateMessage

                this.bot.emit('command',
                    {
                        command_text: raw_message,
                        user: { id: user_id.toString() },
                        platform: 'onebot11'
                    })
            }

            if (event.message_type === 'group') {
                const { user_id, group_id, sender, raw_message } = event as GroupMessage
                this.bot.emit('command',
                    {
                        command_text: raw_message,
                        channel: { id: group_id.toString() },
                        user: { id: user_id.toString() },
                        platform: 'onebot11'
                    })
            }
            return "ok"
        }
    }
}

type Sender = {
    user_id: number; // 发送者 QQ 号
    nick: string; // 发送者昵称
    sex: 'male' | 'female' | 'unknown'; // 发送者性别
    age: number; // 发送者年龄
};

type GroupSender = Sender & {
    area: string; // 发送者地区
    card: string; // 群名片（仅群聊有效）
    level: string; // 群等级（仅群聊有效）
    role: 'owner' | 'admin' | 'member'; // 群成员身份（仅群聊有效）
    title: string; // 群头衔（仅群聊有效）
}
