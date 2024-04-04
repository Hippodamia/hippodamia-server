import {expect, test} from "bun:test";
import {UserDataService} from "../src/data/userDataService";


const service = new UserDataService('test_user_1')

test("getUserCoins", async () => {
    expect(await service.getUserCoins()).toBe(200);
});

test("addUserCoins", async () => {
    const coins = await service.getUserCoins()
    await service.updateUserCoins(+200)
    expect(await service.getUserCoins()).toBe(coins + 200);
});

