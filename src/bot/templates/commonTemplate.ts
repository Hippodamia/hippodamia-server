
//最主要的帮助消息模板
export function helpTemplate() {
    return ['📖CuhMoon手册', '- race 查看有关比赛的指令', '- 签到 进行每日签到', '- 小马积分 查看当前拥有的小马积分'].join('\n')
}

//基于列表创建分页
export function paginationTemplate(data: string[], page: { size: number, count: number }, command: string) {

    const size = page.size;
    const count = page.count;
    const start = (page.count - 1) * size;
    const list = data.slice(start, start + size);
    const pagination = ['当前第' + page.count + '页,共' + Math.ceil(data.length / size) + '页', `使用 ${command} 来换页`]
    return [...list, ...pagination].join('\n');
}
