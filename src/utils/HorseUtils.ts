import { Horse, Race } from "@hippodamia/core";


export class HorseUtils {

    /**
     * 辅助函数:从赛场中根据可选的筛选规则随机出不重复的选手对象
     * @param race 
     * @param count 
     * @param filter 
     */
    static getRandomHorsesByCount(race: Race, count: number, filter?: (horse: Horse) => boolean): Horse[] {
        const horses = race.getHorses().filter(filter || (() => true));
        // 如果赛场中没有符合筛选条件的选手,则直接返回所有选手
        if (horses.length <= count) {
            return horses;
        }

        const result = [] as Horse[];

        while (count > 0 && horses.length > 0) {
            const index = Math.floor(Math.random() * horses.length);
            const horse = horses[index];
            if (!result.includes(horse)) {
                result.push(horse);
                count--;
            }
            horses.splice(index, 1);
        }
        return result;
    }



    /**
     * 辅助函数:从赛场中随机选取一个和提供选手不同的选手
     * @param race 
     * @param horse 
     * @returns 返回一个对象,包含随机选取的选手对象和其在赛场中的索引
     */
    static getRandomHorseNotSelf(race: Race, horse: Horse): { horse: Horse, index: number } {
        const horses = race.getHorses().filter(h => h != horse);
        const index = Math.floor(Math.random() * horses.length);
        return { horse: horses[index], index:race.getHorses().lastIndexOf(horses[index]) };
    }


    
}

