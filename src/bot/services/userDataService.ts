import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

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
            return await prisma.user.findFirst({
                where: {
                    qqId: this.platform_id
                }
            });
        } catch (e) {
            this.createDefaultUser()
        }
    }

    //创建默认用户数据
    private createDefaultUser() {
        try {
            prisma.user.create({
                data: {
                    qqId: this.platform_id,
                    nick: '🐎',
                    coins: 100
                }
            })
        } catch (e) {
            throw "创建用户数据失败";
        }
    }

    public async updateUserNick(nick: string) {

    }

    //增加用户的积分
    public async updateUserCoins(coins: number) {
        await prisma.user.update({
            where: {
                qqId: this.platform_id
            },
            data: {
                coins: {
                    increment: coins
                }
            }
        })
    }
}

export  class ShopDataService {
    async getShops(){
        return await prisma.shop.findMany();
    }
}
