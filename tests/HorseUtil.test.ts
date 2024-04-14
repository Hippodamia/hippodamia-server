import { Race, Horse } from '@hippodamia/core'; // Replace with actual path

import { HorseUtils } from '../src/utils/HorseUtils';
import { expect, describe, it, test } from "bun:test";
describe('Race getRandomHorsesByCount', () => {
    it('should return all horses if count is greater than available horses count', () => {
        const race = new Race();
        race.join({ id: '1' }, '1')
        race.start();
        const allHorses = race.getHorses();
        const result = HorseUtils.getRandomHorsesByCount(race, allHorses.length + 1);
        expect(result).toEqual(allHorses);
    });

    it('should return specified number of horses when count is valid', () => {
        const race = new Race(/* add necessary parameters */);
        race.join({ id: '1' }, '1')
        race.join({ id: '2' }, '1')
        race.join({ id: '4' }, '1')
        race.join({ id: '5' }, '1')
        race.join({ id: '6' }, '1')
        race.start();

        const count = 3;
        const result = HorseUtils.getRandomHorsesByCount(race, count);
        expect(result.length).toBe(count);
    });

    it('should return horses based on the provided filter', () => {
        const race = new Race(/* add necessary parameters */);
        race.join({ id: '1' }, '1')
        race.join({ id: '2' }, '1')
        race.join({ id: '4' }, '1')
        race.join({ id: '5' }, '1')
        race.join({ id: '6' }, '1')
        race.start();

        race.getHorses()[0].step = 5;
        race.getHorses()[1].step = 5;
        const filter = (horse: Horse) => horse.step > 2 // Example filter
        const result = HorseUtils.getRandomHorsesByCount(race, 3, filter);
        const allFilteredHorses = race.getHorses().filter(filter);
        expect(result.every((horse) => allFilteredHorses.includes(horse))).toBe(true);
    });
});