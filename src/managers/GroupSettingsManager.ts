import { GameModeSetting, GroupSetting } from "../types";
//import json5 from 'json5'
import * as fs from 'node:fs';
import {packageDirectorySync} from 'pkg-dir'

export class GroupSettingsManager {

    path =  packageDirectorySync()+`/config/groups_settings.json`

    settings: { 'global': GroupSetting, [key: string]: GroupSetting } = { 'global': {} }

    static instance: GroupSettingsManager = new GroupSettingsManager()

    constructor() {
        if (GroupSettingsManager.instance)
            return GroupSettingsManager.instance
        this.load()
    }
    public reload() {
        this.load()
    }
    public get(key?: string) {
        if (key == undefined || this.settings[key] == undefined)
            return this.settings['global']
        return this.settings[key]
    }

    /**
     * 为群组进行设置
     * @param key 群组ID
     * @param modify 需要修改的设置
     */
    public set(key: string, modify: Partial<GroupSetting>) {
        if (this.settings[key] == undefined) {
            this.settings[key] = { enable: true, admins: [] }
        }
        this.settings[key] = { ...this.settings[key], ...modify }
        this.save()
    }

    /**
     * 获取对应群组的所有管理员，包括全局管理员
     * @param channel 群组ID
     * @returns 群组的管理员列表
     */
    public getAdminList(channel?: string): string[] {
        if (!channel || channel == 'global')
            return this.settings['global']?.admins ?? []
        return [...this.settings[channel]?.admins ?? [], ...this.getAdminList('global')]
    }

    private load() {
       
        this.settings = JSON.parse(fs.readFileSync(this.path, 'utf-8').toString())
    }

    private save() {
        
        fs.writeFileSync(this.path, JSON.stringify(this.settings, null, 2))
    }

    /**
     * 获取对应群组的游戏模式设置
     * 会根据默认配置<全局设置<分群设置来覆盖
     * @param group 群组ID
     * @returns 群组的游戏模式设置
     */
    public getModes(group: string): { 'pure': GameModeSetting, 'random': GameModeSetting } & { [key: string]: GameModeSetting } {

        //纯净模式的默认设置
        const pure: GameModeSetting = {
            speed: 5,
            length: 12,
            min_player: 2,
            max_player: 6,
            interval: 6,
            alias: ['纯净模式', '普通模式', '普通', '纯净', 'p']
        }

        //随机事件的默认设置
        const random: GameModeSetting = {
            speed: 5,
            length: 14,
            min_player: 2,
            max_player: 8,
            interval: 7,
            luck: 1,
            effect_resistance: 1,
            alias: ['随机事件', '随机模式', 're']
        }

        return { ...{ 'random': random, 'pure': pure }, ...this.settings['global'].game ?? {}, ...this.settings[group]?.game ?? {} }
    }
}
