declare module "src/OPQAdapter" {
    import { Adapter, Bot } from "@hippodamia/bot";
    export class OPQAdapter implements Adapter {
        baseUrl: string;
        ws: WebSocket;
        bot: string;
        info: {
            version: string;
            name: string;
            desc: string;
        };
        constructor(url?: string);
        send(content: string | string[], target: {
            channel?: string;
            user?: string;
        }): void;
        init?(bot: Bot): void;
    }
}
declare module "src/OnebotAdapter" {
    import { Adapter, Bot } from "@hippodamia/bot";
    export type OneBotConfig = {
        mode: 'http';
        port: number;
        secret?: string;
        api: string;
    } | {
        mode: 'ws';
        host: string;
        port: number;
        secret?: string;
    } | {
        mode: 'null';
    };
    export class OneBotAdapter implements Adapter {
        info: {
            version: string;
            name: string;
            desc: string;
        };
        api?: string;
        bot: Bot;
        constructor(config: OneBotConfig);
        send(content: string | string[], target: {
            channel?: string | undefined;
            user?: string | undefined;
        }): void;
        init?(bot: Bot): void;
        handler: {
            message: (event: MessageEvent) => string;
        };
    }
    interface MessageEvent {
        post_type: 'message';
        /** 消息类型 */
        message_type: string;
        /** 消息子类型 */
        sub_type: string;
        /** 消息 ID */
        message_id: number;
        /** 发送者 QQ 号 */
        user_id: number;
        /** 消息内容 */
        /** 原始消息内容 */
        raw_message: string;
        /** 字体 */
        font: number;
    }
}
declare module "src/bot/templates/commonTemplate" {
    export function helpTemplate(): string;
    export function paginationTemplate(data: string[], page: {
        size: number;
        count: number;
    }, command: string): string;
}
declare module "src/data/db/schema" {
    export const users: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "users";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "users";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            qqId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "qq_id";
                tableName: "users";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            nick: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "nick";
                tableName: "users";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            prefix: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "prefix";
                tableName: "users";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            suffix: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "suffix";
                tableName: "users";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            coins: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "coins";
                tableName: "users";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
    export type User = typeof users.$inferSelect;
    export type NewUser = typeof users.$inferInsert;
}
declare module "src/data/data-source" {
    const db: import("drizzle-orm/bun-sqlite").BunSQLiteDatabase<Record<string, never>>;
    export default db;
}
declare module "src/data/userDataService" {
    export class UserDataService {
        private platform_id;
        constructor(platform_id: string);
        getUserCoins(): Promise<number | null | undefined>;
        getUserNick(): Promise<string | null | undefined>;
        /**
         * 获取用户信息
         */
        getUserInfo(): Promise<{
            id: number;
            qqId: string;
            nick: string | null;
            prefix: string | null;
            suffix: string | null;
            coins: number | null;
        } | undefined>;
        /**
         * 更新用户的昵称
         * @param nick
         */
        updateUserNick(nick: string): Promise<void>;
        /**
         * 增加用户的积分
         * @param coins
         */
        updateUserCoins(coins: number): Promise<void>;
        /**
         * 创建默认用户数据
         * @private
         */
        private createDefaultUser;
    }
}
declare module "src/types" {
    import { Race } from "@hippodamia/core";
    import { Context } from "@hippodamia/bot";
    export interface PlayerInfo {
        userId: string;
        userName?: string;
        userNickName?: string;
    }
    /**
     * 房间
     * 与平台的频道耦合，是针对一个频道（子频道）来说的唯一索引区域。
     */
    export interface Room {
        channelId: string;
        playerList: PlayerInfo[];
        race: Race;
        started?: boolean;
    }
    /**
     * 路由
     */
    export type CommandRouter = (ctx: Context) => void | Promise<void>;
    export interface Shop {
        name: string;
        description: string;
        items: ShopItem[];
    }
    export interface ShopItem {
        name: string;
        description: string;
        price: number;
        discount?: number;
        type?: 'global_limit' | 'user_limit' | 'no_limit';
        limit?: number;
    }
    export type GameSettings = Partial<{
        enable: boolean;
        admins: string[];
        cd: number;
        game: {
            [key: string]: Partial<{
                speed: number;
                min_player: number;
                max_player: number;
                length: number;
                luck: number;
                effect_resistance: number;
                exclude: string[];
                base_mode: string;
            }>;
        };
    }>;
}
declare module "src/api/groups_settings" {
    import { FastifyInstance } from 'fastify';
    const routes: (fastify: FastifyInstance) => Promise<void>;
    export default routes;
}
declare module "src/api/index" {
    function startListen(): Promise<void>;
    export { startListen };
}
declare module "src/bot/services/configService" {
    import { Shop } from "src/types";
    export function readShops(): Shop[];
}
declare module "src/utils" {
    /**
     * Recursively reads files in a directory and applies a handler function to each file.
     *
     * @param {string} directory - The directory to start reading files from.
     * @param {(filePath: string) => void} handler - The function to apply to each file.
     */
    export function readFilesRecursive(directory: string, handler: (filePath: string) => void): void;
    /**
     * Returns an array of all files in the given directory and its subdirectories.
     *
     * @param directory - The directory to search recursively.
     * @return An array of absolute file paths.
     */
    export function getFilesRecursively(directory: string): string[];
    /**
     * Generates a random emoji from a predefined list of emojis.
     *
     * @return {string} The randomly generated emoji.
     */
    export function randomEmoji(): string;
    /**
     * Shuffles the elements of an array randomly.
     *
     * @param {any[]} array - The array to be shuffled.
     * @return {any[]} The shuffled array.
     */
    export const shuffle: (array: any[]) => any[];
    export class I18n {
        translations: Record<string, string>;
        constructor(language: string, directory: string);
        parseLanguageFile(content: string): Record<string, string>;
        translate(key: string): string;
        build(): this;
    }
}
declare module "src/hippodamia" {
    import { Bot } from "@hippodamia/bot";
    import { I18n } from "src/utils";
    export class Hippodamia {
        static instance: Hippodamia;
        i18n: I18n & {
            [key: string]: string;
        };
        bot: Bot;
        constructor();
    }
}
declare module "src/managers/GroupSettingsManager" {
    import { GameSettings } from "src/types";
    export class GroupSettingsManager {
        settings: {
            'global': GameSettings;
            [key: string]: GameSettings;
        };
        static instance: GroupSettingsManager;
        constructor();
        reload(): void;
        get(key?: string): Partial<{
            enable: boolean;
            admins: string[];
            cd: number;
            game: {
                [key: string]: Partial<{
                    speed: number;
                    min_player: number;
                    max_player: number;
                    length: number;
                    luck: number;
                    effect_resistance: number;
                    exclude: string[];
                    base_mode: string;
                }>;
            };
        }>;
        set(key: string, modify: Partial<GameSettings>): void;
        getAdminList(channel?: string): string[];
        private load;
        private save;
    }
}
declare module "src/bot/routes/coins/userCoin" {
    import { CommandRouter } from "src/types";
    export const queryUserCoins: CommandRouter;
}
declare module "src/bot/services/RoomService" {
    import { PlayerInfo, Room } from "src/types";
    class RoomService {
        private rooms;
        private allow_time_room;
        getRoom(channelId: string): Room | undefined;
        createRoom(room: Room): boolean;
        removeRoom(channelId: string): void;
        addPlayer(roomId: string, player: PlayerInfo): void;
        refreshListUI(room: Room): void;
    }
    const roomService: RoomService;
    export default roomService;
}
declare module "src/bot/templates/raceTemplate" {
    export function raceCreatedTemplate(mode?: string): string;
    export function playerJoinedTemplate(nick: string, currentPlayerCount: number): string;
}
declare module "src/bot/routes/games/race" {
    import { CommandRouter } from "src/types";
    export const createRace: CommandRouter;
    export const joinRace: CommandRouter;
    export const addFakePlayer: CommandRouter;
    export const startRace: CommandRouter;
}
declare module "src/bot/routes/shops/shop" {
    import { CommandRouter } from "src/types";
    export const showShops: CommandRouter;
    export const showShopItems: CommandRouter;
}
declare module "src/bot/routes/hippodamia/index" {
    import { CommandRouter } from "src/types";
    export const hippodamiaRoutes: {
        [key: string]: CommandRouter;
    };
}
declare module "src/bot/routes/index" {
    export * from "src/bot/routes/coins/userCoin";
    export * from "src/bot/routes/games/race";
    export * from "src/bot/routes/shops/shop";
    export * from "src/bot/routes/hippodamia/index";
}
declare module "src/managers/ServerSettingsManager" {
    import { OneBotConfig } from "src/OnebotAdapter";
    interface HippodamiaAPISettings {
        api: {
            port: number;
        };
    }
    type OnebotServerSettings = {
        mode: 'onebot';
        onebot: OneBotConfig;
    };
    type TestServerSettings = {
        mode: 'test';
        test: OneBotConfig;
    };
    type ServerSettings = HippodamiaAPISettings & (OnebotServerSettings | TestServerSettings);
    export default class ServerSettingsManager {
        static instance: ServerSettingsManager;
        settings: ServerSettings;
        constructor();
        /**
         * 读取settings.json下关于赛马服务器的配置信息
         */
        load(): boolean;
        /**
         * 获取默认的服务配置
         * @returns 默认的设置
         */
        defaultSetttings(): ServerSettings;
    }
}
declare module "src/components/random-events/types" {
    import { Horse, Race } from "@hippodamia/core";
    export interface RandomEvent {
        name: string;
        alias: string;
        type: RandomEventType;
        desc: string;
        handler: (race: Race, horse: Horse) => void;
    }
    export enum RandomEventType {
        Positive = 0,
        Negative = 1,
        Neutral = 2
    }
}
declare module "src/components/random-events/RandomEventManager" {
    import { IContentManager } from '@hippodamia/core';
    import { RandomEvent } from "src/components/random-events/types";
    export class RandomEventManager implements IContentManager<RandomEvent> {
        static instance: RandomEventManager;
        constructor();
        getRandom(filter: (content: RandomEvent) => boolean): RandomEvent;
        getAll(): RandomEvent[];
        /**
         * 随机事件的列表
         */
        events: Map<string, RandomEvent>;
        register(event: RandomEvent): void;
        get(name: string): RandomEvent | undefined;
        listNames(): IterableIterator<string>;
        loadRandomEvents(): void;
    }
}
declare module "src/app" { }
declare module "src/bot/services/RandomService" {
    export function generateRandomText(length: number): string;
    export function generateRandomGameName(): string;
}
declare module "src/components/random-events/RandomEventComponent" {
    import { HipEmitterTypes, IContentManager } from '@hippodamia/core';
    import { RandomEvent } from "src/components/random-events/types";
    import EventEmitter from 'eventemitter3';
    export class RandomEventComponent extends EventEmitter<HipEmitterTypes> {
        constructor(manager: IContentManager<RandomEvent>);
        info(): {
            name: string;
            alias: string[];
        };
        name: string;
    }
}
declare module "tests/db.test" { }
