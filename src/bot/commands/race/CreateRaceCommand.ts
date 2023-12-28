/*

import {Race} from '../../../core/Race';
import {errorCard, playerListCard} from "../../templates/cardTemplateRender";
import roomService from "../../services/RoomService";

//...

class CreateRaceCommand extends BaseCommand {
    name = "create";
    description = "Create a race";

    func: CommandFunction<BaseSession, void> = async (session) => {

        const channelId = session.channelId
        const race = new Race();

        console.log('join')
        if (roomService.createRoom({channelId: channelId, race, playerList: [], playerListCard: ''})) {
            const card = new Card();
            card.addTitle('创建比赛')
            card.addDivider()
            card.addText('> 注意:当前版本仅支持创建 **纯净赛场**')
            card.addText('😘 比赛创建成功!')
            card.addDivider()
            card.addModule({
                type: "action-group",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: 'plain-text',
                            content: '立刻加入比赛'
                        },
                        theme: "info",
                        click: "return-val",
                        value: "join_race"
                    },
                    {
                        type: "button",
                        text: {
                            type: 'plain-text',
                            content: '生成随机玩家'
                        },
                        theme: "info",
                        click: "return-val",
                        value: "join_race_random"
                    }
                ]

            })

            const listCard = playerListCard([], '加入这场比赛!');
            console.log('reply')

            await session.reply(card)
            let {data} = await session.reply(listCard)
            if (data) {
                roomService.getRoom(channelId)!.playerListCard = data.msg_id
            }
        } else {
            await session.reply(errorCard('创建失败', '', '此频道已创建Room'))
        }


    }
}

const createRaceCommand = new CreateRaceCommand();
export default createRaceCommand
*/
