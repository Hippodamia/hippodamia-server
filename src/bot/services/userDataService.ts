import {AppDataSource} from "../../data/data-source";
import {User} from "../../data/entity";

export class UserDataService {
    private platform_id: string;

    constructor(platform_id: string) {
        this.platform_id = platform_id;
    }


    async getUserCoins() {
        return (await this.getUserInfo()).coins;
    }

    async getUserNick() {
        return (await this.getUserInfo()).nick;
    }

    async getUserInfo() {
        try {
            return await AppDataSource.manager.findOne(User,{where:{qqId:this.platform_id}}) ?? await this.createDefaultUser();
        } catch (e) {
            console.log(e)
        }
    }

    //创建默认用户数据
    private async createDefaultUser() {
        try {
            console.log('[UDS]尝试创建新用户'+this.platform_id)
            return AppDataSource.manager.create(User, {
                qqId: this.platform_id,
                nick: '🐎',
                coins: BigInt(200)
            });
        } catch (e) {
            throw "创建用户数据失败";
        }
    }

    /**
     * 更新用户的昵称
     * @param nick
     */
    public async updateUserNick(nick: string) {
        let user = await AppDataSource.manager.findOne(User,{where:{qqId:this.platform_id}})
        user.nick=nick;
        return user;
    }

    /**
     * 增加用户的积分
     * @param coins
     */
    public async updateUserCoins(coins: number) {
        let user = await AppDataSource.manager.findOne(User,{where:{qqId:this.platform_id}})
        user.coins += BigInt(coins);
        user.save();
        return user;
    }
}

