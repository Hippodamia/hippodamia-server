import {Adapter, Bot} from "@hippodamia/bot";
import WebSocket from "ws";

interface OPQPack {
    CurrentPacket: {
        EventData: any;
        EventName: string;
    };
    CurrentQQ: number
}

export class OPQAdapter implements Adapter {

    baseUrl:string

    constructor(url = '127.0.0.1:8086') {
        this.baseUrl=url;
    }

    ws: WebSocket
    bot:string

    info = { version: '0.1', name: 'opq', desc: '针对QQNT框架OPQ的插件' };

    send(content: string | string[], target: { channel?: string; user?: string; }) {
        let raw = typeof content == 'string' ? content : content.join('');

        function extractAndReplace(text) {
            let pattern = /\[@(.*?)]/g;
            let name_ids:{name:string,id:string}[] = [];
            let replacedText = text.replace(pattern, (match, group) => {
/*                let [name, id] = group.split(',');
                name_ids.push({name, id});
                return `@${name}`;*/
                return `@${name}`
            });
            return {name_ids, replacedText};
        }

        let {name_ids, replacedText} = extractAndReplace(raw);
         raw = replacedText
        let body = {
            "CgiCmd": "MessageSvc.PbSendMsg",
            "CgiRequest": {
                "ToUin": target.channel != undefined ? target.channel : target.user,
                "ToType": target.channel != undefined ? 2 : 1, //3私聊 2群组 1好友
                "Content": raw,
                "AtUinLists": name_ids.length==0?null: name_ids.map(x=>({Nick:x.name,Uin:parseInt(x.id)}))

/*                "AtUinLists": [
                    /!*                    {
                                            "Uin": 123456789
                                        },*!/
                ],
                "Images": [
                    /!*                    {
                                            "FileId": 2780922102,
                                            "FileMd5": "0N6b4nNKvivUxHQCB+E0QA==",
                                            "FileSize": 34880
                                        }*!/
                ],
                "Voice": {
                    /!*                    "FileMd5": "fk5AXTZkLcEp8tK0jGINgQ==",
                                        "FileSize": 47121,
                                        "FileToken": "9Ai1NvpkGg0agwBve1knSgmb1DyYijbzyRgw"*!/
                }*/
            }
        }
        let requestOptions = {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'User-Agent': 'Hippodamia/1.0.0',
            },
            body:JSON.stringify(body)
        };
        console.log(JSON.stringify(body))
        fetch( `http://${this.baseUrl}/v1/LuaApiCaller?funcname=MagicCgiCmd&timeout=10&qq=${this.bot}`, requestOptions).then(req=>{
            req.text().then(text=>{
                console.debug(text)
            })
        }).catch(e => {
            console.log('[OPQAdapter]'+e)
        })

    }

    init?(bot: Bot) {

        this.ws = new WebSocket(`ws://${this.baseUrl}/ws`);
        this.ws.on('error',()=>{
            console.log('[OPQAdapter]连接失败')
        })
        this.ws.on('open', () => {
            console.log('[OPQAdapter]已连接:'+this.ws.url)
        })
        this.ws.on('message', (data) => {
            const opq = JSON.parse(data.toString()) as OPQPack;
            this.bot = opq.CurrentQQ.toString();
            try{
                switch (opq.CurrentPacket.EventName) {
                    case "ON_EVENT_GROUP_NEW_MSG":
                        let user = {
                            id: opq.CurrentPacket.EventData.MsgHead.SenderUin,
                            name: opq.CurrentPacket.EventData.MsgHead.SenderNick
                        }
                        let command = opq.CurrentPacket.EventData.MsgBody.Content;
                        let channel = {id: opq.CurrentPacket.EventData.MsgHead.FromUin}
                        //console.log(opq.CurrentPacket.EventData.MsgBody)
                        bot.emit('command', {user, command, channel, platform: 'opq'})
                        break;
                    case "ON_EVENT_FRIEND_NEW_MSG":
                        break;
                    default:
                        break;
                }
            }catch (e){
                console.log(e);
            }


        })
    }


}
