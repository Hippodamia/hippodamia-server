import {users} from "./db/schema";
import db from "./data-source";
import {eq} from 'drizzle-orm';

export class UserDataService {
    private platform_id: string;

    constructor(platform_id: string) {
        this.platform_id = platform_id;
    }


    async getUserCoins() {
        return (await this.getUserInfo())?.coins;
    }

    async getUserNick() {
        return (await this.getUserInfo()).nick;
    }

    /**
     * 获取用户信息
     */
    async getUserInfo() {
        try {
            const userList = await db.select().from(users).where(eq(users.qqId, this.platform_id))
            if (userList.length == 0)
                return await this.createDefaultUser()
            return userList[0];
        } catch (e) {
            console.log(e)
            return undefined
        }

    }

    /**
     * 更新用户的昵称
     * @param nick
     */
    public async updateUserNick(nick: string) {
        return db.update(users).set({
            nick
        }).where(eq(users.qqId, this.platform_id));
    }

    /**
     * 增加用户的积分
     * @param coins
     */
    public async updateUserCoins(coins: number) {
        await db.update(users).set({
            coins: await this.getUserCoins() + coins
        }).where(eq(users.qqId, this.platform_id)).execute();
    }

    /**
     * 创建默认用户数据
     * @private
     */
    private async createDefaultUser() {
        try {
            console.log('[UDS]尝试创建新用户' + this.platform_id)
            return (await db.insert(users).values({
                qqId: this.platform_id,
                nick: '🐎',
                coins: 200
            }).returning())[0];
        } catch (e) {
            console.log('[UDS]创建用户数据失败', e)
            return undefined;
        }
    }
}

