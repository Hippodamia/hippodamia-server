import roomService from "../../services/RoomService";
import {Race} from "@hippodamia/core";
import {raceCreatedTemplate} from "../../templates/raceTemplate";
import {paginationTemplate} from "../../templates/commonTemplate";
import {CommandRouter} from "../../../types";
import {readShops} from "../../services/configService";

import {Context} from "@hippodamia/bot";

export const showShops:CommandRouter =  async (ctx) => {
    const cid = ctx.channel!.id;
    //read json from './data/shops/*.json'
    const shops = readShops();
    ctx.reply(
        '使用 /<商店名> 查看商店具体内容\n',
        paginationTemplate(shops.map(x=>'- '+ x.name), {size: 10, count: 1}, "/小马商店 <页数>"))
}


export const showShopItems:CommandRouter =  async (ctx:Context) => {
    const cid = ctx.channel!.id;
    const shop_name =  ctx.command!.name
    //read json from './data/shops/*.json'
    const shops = readShops();

    if (shops.findIndex(shop=>shop_name == shop.name)>=0){
        const shop = shops.find(shop=>shop_name == shop.name)!
        ctx.reply(
            paginationTemplate(shop.items.map(x=>`- ${x.name} | 价格:${x.price}`), {size: 10, count: 1}, `/${shop_name} <页数>`))
    }

}
