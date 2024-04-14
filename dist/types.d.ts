/// <reference types="ws" />
/// <reference types="bunyan" />
declare module "src/OnebotAdapter" {
    import { Adapter, Bot } from "@hippodamia/bot";
    import { Message } from "onebot-client";
    import { WebSocket } from "ws";
    export type OneBotConfig = {
        mode: 'http';
        port: number;
        secret?: string;
        api: string;
    } | {
        mode: 'ws';
        url: string;
        secret?: string;
        bot: string;
    } | {
        mode: 'null';
    };
    export class OneBotAdapter implements Adapter {
        info: {
            version: string;
            name: string;
            desc: string;
        };
        api: {
            sendGroupMessage: (group_id: string, message: string, auto_escape?: boolean) => Promise<number>;
            sendPrivateMessage: (user_id: string, message: string, auto_escape?: boolean) => Promise<number>;
        };
        bot: Bot;
        config: OneBotConfig;
        client?: OneBotWsClient;
        private getApiUrl;
        private http_apis;
        constructor(config: OneBotConfig);
        send(content: string | string[], target: {
            channel?: string | undefined;
            user?: string | undefined;
        }): void;
        /**
         * 初始化bot与消息处理器
         * @param bot
         * @returns
         */
        init?(bot: Bot): void;
        handler: {
            message: (event: Message) => string;
        };
    }
    class OneBotWsClient {
        ws: WebSocket;
        constructor(url: string, bot_id: number, secret: string);
        apis: OneBotAdapter['api'];
        private sendAction;
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
        getUserCoins(): Promise<number>;
        getUserNick(): Promise<string>;
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
    export type GameModeSetting = Partial<{
        /** 速度: 0-20 */
        speed: number;
        /** 最少玩家数量 */
        min_player: number;
        /** 最多玩家数量 */
        max_player: number;
        /** 赛道长度 */
        length: number;
        /** 幸运 */
        luck: number;
        /** 效果抵抗 */
        effect_resistance: number;
        /** 内容排除 */
        exclude: string[];
        /** 前置模式 */
        base_mode: string;
        /** 消息间隔 */
        interval: number;
        /** 别名 */
        alias: string[];
    }>;
    export type GroupSetting = Partial<{
        enable: boolean;
        admins: string[];
        cd: number;
        game: {
            [key: string]: GameModeSetting;
        };
    }>;
}
declare module "src/api/groups_settings" {
    import { FastifyInstance } from 'fastify';
    const routes: (fastify: FastifyInstance) => Promise<void>;
    export default routes;
}
declare module "src/utils/I18n" {
    import { BaseLogger } from "@hippodamia/bot";
    export class I18n {
        translations: Record<string, string>;
        constructor(language: string, directory: string, logger: BaseLogger);
        parseLanguageFile(content: string): Record<string, string>;
        translate(key: string): string;
        build(): this;
    }
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
    type LoggingSettings = {
        level: 'info' | 'debug' | 'warn' | 'error' | 'fatal' | 'trace';
    };
    type ServerSettings = HippodamiaAPISettings & (OnebotServerSettings | TestServerSettings) & {
        logging: LoggingSettings;
    };
    export default class ServerSettingsManager {
        static instance: ServerSettingsManager;
        settings: ServerSettings;
        path: string;
        constructor(path?: string);
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
declare module "src/utils" {
    import Logger from "bunyan";
    import { BaseLogger } from "@hippodamia/bot";
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
    export function wrapLogger(level: BaseLogger['level'], logger: Logger): BaseLogger;
}
declare module "src/hippodamia" {
    import { BaseLogger, Bot } from "@hippodamia/bot";
    import { I18n } from "src/utils/I18n";
    export class Hippodamia {
        static instance: Hippodamia;
        logger: BaseLogger;
        i18n: I18n & {
            [key: string]: string;
        };
        bot: Bot;
        constructor();
    }
}
declare module "src/api/index" {
    function startListen(): Promise<void>;
    export { startListen };
}
declare module "src/bot/services/configService" {
    import { Shop } from "src/types";
    export function readShops(): Shop[];
}
declare module "src/managers/GroupSettingsManager" {
    import { GameModeSetting, GroupSetting } from "src/types";
    export class GroupSettingsManager {
        path: string;
        settings: {
            'global': GroupSetting;
            [key: string]: GroupSetting;
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
                    speed: number; /**
                     * 为群组进行设置
                     * @param key 群组ID
                     * @param modify 需要修改的设置
                     */
                    min_player: number;
                    max_player: number;
                    length: number;
                    luck: number;
                    effect_resistance: number;
                    exclude: string[];
                    base_mode: string;
                    interval: number;
                    alias: string[];
                }>;
            };
        }>;
        /**
         * 为群组进行设置
         * @param key 群组ID
         * @param modify 需要修改的设置
         */
        set(key: string, modify: Partial<GroupSetting>): void;
        /**
         * 获取对应群组的所有管理员，包括全局管理员
         * @param channel 群组ID
         * @returns 群组的管理员列表
         */
        getAdminList(channel?: string): string[];
        private load;
        private save;
        /**
         * 获取对应群组的游戏模式设置
         * 会根据默认配置<全局设置<分群设置来覆盖
         * @param group 群组ID
         * @returns 群组的游戏模式设置
         */
        getModes(group: string): {
            'pure': GameModeSetting;
            'random': GameModeSetting;
        } & {
            [key: string]: GameModeSetting;
        };
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
        /**
         * 获取一个房间对象
         * @param channelId
         */
        getRoom(channelId: string): Room | undefined;
        /**
         * 新增一个房间，如果本群组存在这个房间，则会异常
         * @param room 房间对象(信息)
         * @returns
         */
        createRoom(room: Room): boolean;
        /**
         * 删除指定群组的房间，并为这个群组设置冷却时常
         * 冷却时常取决于群组设置中的 cd 字段
         * @param channelId 群组ID
         */
        removeRoom(channelId: string): void;
        addPlayer(roomId: string, player: PlayerInfo): void;
        refreshListUI(room: Room): void;
    }
    const roomService: RoomService;
    export default roomService;
}
declare module "src/bot/templates/raceTemplate" {
    const map: {
        pure: string;
        random: string;
        contract: string;
    };
    export function raceCreatedTemplate(mode?: keyof typeof map): string;
    export function playerJoinedTemplate(nick: string, currentPlayerCount: number): string;
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
declare module "src/components/random-events/RandomEventManager" {
    import { IContentManager } from '@hippodamia/core';
    import { RandomEvent } from "src/components/random-events/types";
    import { BaseLogger } from '@hippodamia/bot';
    export class RandomEventManager implements IContentManager<RandomEvent> {
        static instance: RandomEventManager;
        logger: BaseLogger;
        constructor(logger: BaseLogger);
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
declare module "src/components/random-events/index" {
    export * from "src/components/random-events/RandomEventComponent";
    export * from "src/components/random-events/RandomEventManager";
    export * from "src/components/random-events/types";
}
declare module "src/bot/routes/games/race" {
    import { CommandRouter } from "src/types";
    export const createRace: CommandRouter;
    /** 加入命令的路由 */
    export const joinRace: CommandRouter;
    /** fake player的路由 */
    export const addFakePlayer: CommandRouter;
    /** 开始命令的路由 */
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
declare module "src/update" {
    export const version = "1.0.0-alpha";
    export function update(): Promise<boolean>;
    /**
     * 更新config下的内容
     */
    export function updateContents(): Promise<void>;
}
declare module "src/app" { }
declare module "src/bot/services/RandomService" {
    export function generateRandomText(length: number): string;
    export function generateRandomGameName(): string;
}
declare module "tests/db.test" { }
