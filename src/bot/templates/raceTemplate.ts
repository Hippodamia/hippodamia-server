export function raceCreatedTemplate(mode: string = '纯净') {
    return ['🐎比赛创建完毕!', '本群开启了新的比赛!', `比赛采用了:${mode}模式`, '使用 /race join <nick> 来加入比赛', '例如: /race join 辞小镜'].join('\n')
}

export function playerJoinedTemplate(nick: string, currentPlayerCount: number) {
    return ['🐎成功加入比赛!', `- 使用选手:${nick}`, `- 当前已加入:${currentPlayerCount}位选手`, '- 赌上马儿命运的一战即将开始!'].join('\n')
}





