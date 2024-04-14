import { Hippodamia } from "@/hippodamia"

const map = {
    'pure': '纯净赛场',
    'random': '随机事件',
    'contract': '契约之战'
}
export function raceCreatedTemplate(mode: keyof typeof map = 'pure') {

    return Hippodamia.instance.i18n['race.created.message'].replace('%mode%', map[mode])
}

export function playerJoinedTemplate(nick: string, currentPlayerCount: number) {
    return [
        '> 🐎成功加入比赛!',
        `> 使用选手:${nick}`,
        `> 当前已加入:${currentPlayerCount}位选手`,
        '> 赌上马儿命运的一战即将开始!'
    ].join('\n')
}





