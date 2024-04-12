import { WebSocket } from "ws";

const socket = new WebSocket("ws://127.0.0.1:3001");
socket.onopen = () => {
    console.log("Connected to server");
};
socket.onerror = (error) => {
    console.log("WebSocket error:", error);
};
console.log(socket.isPaused)
socket.send("Hello, server!");



// import {bot} from '../src/app';
// import {Race} from "./core/Race";
// import {EffectType} from "./core/types";

// function mock(message: string) {
//     bot.emit('command', {user: {id: '114514'}, command_text: message, channel: {id: '10000'}, platform: 'mock'})
// }

// function renderRace(race:Race):string{
//     return [
//         ...race.logs.map(x=>x.content),
//         '---',
//         ...race.tracks.map(
//             track => {
//                 let line = '.'.repeat(track.segments.length).split('');
//                 track.horses.forEach(horse => {
//                     line[track.segments.length - horse.step] = horse.display
//                 })
//                 return `[${track.horses[0].last_moved??0}]` + line.join('');
//             }
//         )
//     ].join('\n')
// }
// export async function doTest(){
//  /*   mock('/小马商店')

//     mock('/马术天堂')
//     mock('/马术天堂 2')*/

//     mock('/创建赛马 random')
//     mock('/dev fake player 4')
//     mock('/开始赛马');
// }


// export function test(){
//     const race = new Race({
//         speed:10,
//         length:20,
//         mode:'random'
//     })
//     race.join({id:'114514'},'小马')
//     race.join({id:'11445'},'大马')
//     race.join({id:'1145'},'中马')
//     race.join({id:'114'},'迷你马')

//     race.start()

//     let horse = race.getHorses()[0]

//     horse.buffContainer.add({
//         name: 'debug',
//         type: 0,
//         desc: '用来测试bug的buff，会显示所有属性',
//         priority: 100,
//         modifier: (target,buff) => {
//             target.display = `<debug:${buff.remains}><speed:${target.speed},luck:${target.luck},res:${target.effect_resistance}>` + target.display
//             return target
//         }
//     },5)
//     horse.buffContainer.add({
//         name: '超速speed',
//         type: EffectType.Positive,
//         desc: '速度+999?',
//         priority: 1,
//         modifier: (target,buff) => {
//             target.speed+=999;
//             return target
//         }
//     },5)

//     console.log(renderRace(race));
//     race.next()
//     console.log(renderRace(race));
//     race.next()
//     console.log(renderRace(race));
//     race.next()
//     console.log(renderRace(race));
//     race.next()

// }



