import c from "child_process";
import fs from "fs";


export const version = "1.0.0-alpha";


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

    return true;
}

/**
 * 更新config下的内容
 */
export async function updateContents() {
    const content_list = [
        /** 随机事件内容 */
        '/config/scripts/random_events/114514.js',
        '/config/scripts/random_events/wohoo.js',
        '/config/scripts/README.md',
        /** 语言配置内容 */
        '/config/languages/zh_cn_default.lang',
        '/config/settings.default.json',
        /** 同步包json */
        '/package.json'
    ]


    for (const content of content_list) {
        const path = __dirname + content;
        const resp = await fetch('https://gitee.com/heerkaisair/hippodamia-server/raw/main' + content)
        if (!resp.ok) {
            console.log(`[更新检测] 无法获取${content}文件, 请检查网络连接或稍后再试`)
            continue;
        }

        if (fs.existsSync(path))
            fs.rmSync(path, { force: true });

        fs.writeFileSync(path, await resp.text());
        console.log(`[更新检测] ${content}文件更新成功`);
    };
}