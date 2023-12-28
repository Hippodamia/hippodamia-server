import roomService from "../../services/RoomService";
import {Race} from "../../../core/Race";
import {raceCreatedTemplate} from "../../templates/raceTemplate";
import {ShopDataService} from "../../services/userDataService";
import {paginationTemplate} from "../../templates/commonTemplate";
import {CommandRouter} from "../../../types";

export const showShops:CommandRouter = async (ctx) => {
    const cid = ctx.channel.id;
    const service = new ShopDataService();
    const shops = await service.getShops();
    ctx.reply(paginationTemplate(shops.map(x=>x.name), {size: 10, count: 1}, "/小马商店 <页数>"))
}
