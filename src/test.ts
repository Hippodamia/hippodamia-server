import {bot} from './app';

function mock(message: string) {
    bot.emit('command', {user: {id: '114514'}, command: message, channel: {id: '10000'}, platform: 'mock'})
}

export async function doTest(){
    mock('/小马积分')
    mock('/创建赛马')
    mock('/dev fake player 4')

    mock('/开始赛马');
}


