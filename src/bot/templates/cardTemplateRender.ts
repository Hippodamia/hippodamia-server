/*

import {PlayerInfo} from "../../types";
import {Race} from "../../core/Race";
import {RaceMode} from "../../core/types";

export function playerListCard(players: PlayerInfo[], title: string = '当前玩家列表') {
    const card = new Card();
    card.addTitle(title);
    card.addDivider();
    if (players.length == 0) {
        card.addText('> 暂无玩家加入!')

    } else {
        let text = '> **当前加入的玩家:** \n'
        for (let player of players) {
            text += `- ${player.userNickName}\n`;
        }
        card.addText(text)
    }

    return card
}


export function errorCard(title: string, userId: string, error: string) {
    const card = new Card();
    card.addTitle(title);
    if (userId != '') card.addText(`(met)${userId}(met)`)
    card.addText(error)

    return card
}


export function raceCard(race:Race){
    const mode2str: {[key in keyof typeof RaceMode]:string}  = {
        Pure:'纯净跑马场',
        Contract:'无尽契约',
        RandomEvent:'无运之行'
    }

    const card = new Card()
    card.addTitle('比赛进行中!')
    card.addContext(`${race.mode}`)
}

/!*绘制轨道部分*!/
export function raceTracksCard(race:Race){

}

*/
