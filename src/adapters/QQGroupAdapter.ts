import { Adapter, Bot } from "@hippodamia/bot";
import { Client as AmesuClient } from 'amesu';
export type QQGroupConfig =
    {
        app_id: string;
        token: string;
        secret: string;
    }

export class QQGroupAdapter implements Adapter {

    client: AmesuClient;
    last_message_id: string = '';

    info = { version: '1.0', name: 'qq-group', desc: 'QQ Group Adapter' };

    send(content: string, target: { channel?: string | undefined; user?: string | undefined; }): void {
        if (!target.channel) {
            this.client.api.sendDmMessage(target.user!, {
                content: content,
            });
            return;
        }
        this.client.api.sendGroupMessage(target.channel, {
            msg_id: this.last_message_id,
            msg_type: 0,
            content: content,
        });
    }

    code = {
        at: (target:string)=>{
            return '@'+target
        }
    }

    constructor(config: QQGroupConfig) {
        this.client = new AmesuClient({
            appid: config.app_id,
            token: config.token,
            secret: config.secret,
            events: ['GROUP_AND_C2C_EVENT']
        })
    }

    init?(bot: Bot): void {

        this.client.on('group.at.message.create', async (event) => {
            bot.logger.debug(`Received message from ${event.author.id} in ${event.group_openid}: ${event.content}`)
            this.last_message_id = event.id
            bot.emit('command', {
                command_text: event.content.trim(),
                channel: { id: event.group_openid },
                user: { id: event.author.id },
                platform: 'qq-group'
            })
        })

        this.client.online();
        bot.logger.info(`QQ bot client online, app_id: ${this.client.config.appid}`)

    }

}