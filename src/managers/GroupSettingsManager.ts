import {GameSettings} from "../types";
//import json5 from 'json5'
import * as fs from 'node:fs';

export class GroupSettingsManager {
    static settings: { 'global': GameSettings, [key: string]: GameSettings } = {'global': {}}


    public static reload() {
        GroupSettingsManager.load()
    }

    public static get(key?: string) {
        if (key == undefined || GroupSettingsManager.settings[key] == undefined)
            return GroupSettingsManager.settings['global']
        return GroupSettingsManager.settings[key]
    }

    public static set(key: string, modify: Partial<GameSettings>) {
        if (GroupSettingsManager.settings[key] == undefined) {
            GroupSettingsManager.settings[key] = {enable: true, admins: []}
        }
        GroupSettingsManager.settings[key] = {...GroupSettingsManager.settings[key], ...modify}
        GroupSettingsManager.save()
    }

    public static getAdminList(channel?: string) {
        if (!channel || channel == 'global')
            return GroupSettingsManager.settings['global']?.admins ?? []
        return [...GroupSettingsManager.settings[channel]?.admins ?? [], ...this.getAdminList('global')]
    }

    private static load() {
        const path = `./config/groups_settings.json`
        GroupSettingsManager.settings = JSON.parse(fs.readFileSync(path).toString())
        console.log('[GroupSettingsManager]加载配置文件成功')
        console.log(JSON.stringify(GroupSettingsManager.settings))
    }

    private static save() {
        const path = `./config/groups_settings.json`
        fs.writeFileSync(path, JSON.stringify(GroupSettingsManager.settings, null, 2))
    }
}
