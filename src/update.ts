import { resolve } from "path";
import c from "child_process";
import fs from "fs";
import { dirname } from "path";

import { IUpdater, RandomEventUpdater, LanguagesUpdater, ServerSettingsUpdater } from "@/update/";


export const version = "1.0.0-alpha";

const updaters: IUpdater[] = [
    new RandomEventUpdater(),
    new LanguagesUpdater(),
    new ServerSettingsUpdater()
]

export async function update() {
    console.log("[更新检测] 正在发现新版本...");

    const resp = await fetch('https://gitee.com/heerkaisair/hippodamia-server/raw/main/package.json')

    const { version: latest } = await resp.json() as { version: string }


    if (!latest) {
        console.log("[更新检测] 无法获取最新版本号, 请检查网络连接或稍后再试")
        return true;
    }

    if (latest !== version) {
        console.log(`[更新检测] 发现新版本 ${latest}, 请前往gitee发行页面下载最新版编译文件`);
        c.execSync("start https://gitee.com/heerkaisair/hippodamia-server/releases/")
        return false;
    }

    console.log("[更新检测] 当前已是最新版本!")

    await updateContents()

    return true;
}

/**
 * 更新config下的内容
 */
export async function updateContents() {
    for (const updater of updaters) {
        for (const file of updater.list()) {
            await updater.update(file)
        }
    }
}


