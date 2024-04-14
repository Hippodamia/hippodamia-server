import { Horse, Race } from "@hippodamia/core";
import { RandomEventComponent } from "../src/components/random-events/RandomEventComponent";
import { RandomEventManager } from "../src/components/random-events/RandomEventManager";
import { Hippodamia } from "../src/hippodamia";
import ServerSettingsManager from "../src/managers/ServerSettingsManager";
import { renderRace } from "../src/bot/routes/games/race";

new ServerSettingsManager()

new Hippodamia()
const randomEventManager = new RandomEventManager(Hippodamia.instance.logger)


randomEventManager.events.forEach(event => {
    if (!event.name.startsWith('heer'))
        return;

    const race = new Race({ mode: 'random', speed: 10, length: 14 })

    // 创建单独的事件管理器以测试单独事件的运行
    race.components.push(new RandomEventComponent({
        getAll() {
            return [event]

        },
        getRandom() {
            return event
        }
    }))

    race.join({ id: '1' }, '🤡')
    race.join({ id: '2' }, '😘')
    race.join({ id: '3' }, '🤑')
    race.join({ id: '4' }, '🐔')
    race.join({ id: '5' }, '🤩')
    race.join({ id: '6' }, '🐎')

    race.start()


    while (!race.ended && race.round < 5) {
        race.next()
        console.log(renderRace(race))
    }




})
