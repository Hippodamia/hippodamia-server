import { resolve, dirname } from "path";
import fs from "fs";
import { IUpdater, UpdateFile } from "./IUpdater";
import { date } from "drizzle-orm/mysql-core";


export abstract class HippodamiaUpdater implements IUpdater {

    remote(file: UpdateFile): string {
        return 'https://gitee.com/heerkaisair/hippodamia-server/raw/main' + (file.file.startsWith('/') ? '' : '/') + file.file;
    }

    async update(file: UpdateFile): Promise<boolean> {
        if (file.overwrite == undefined) {
            file.overwrite = true;
        }
        try {
            const path = resolve('.' + file.file);
            const resp = await fetch(this.remote(file));

            if (!resp.ok) {
                console.log(`[更新检测] 无法获取${file.file}文件, 请检查网络连接或稍后再试`);
                return false;
            }

            const dir = dirname(path);
            fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });

            const text = await resp.text(); // 获取文件内容

            if (fs.existsSync(path)) {
                const data = await fs.readFileSync(path, 'utf-8');
                if (data === text) {
                    console.log(`[更新检测] ${file.file}文件无需更新`);
                    return true;
                }
            }

            console.log(fs.existsSync(path))
            // overwrite
            if (fs.existsSync(path) && file.overwrite == true) {
                fs.rmSync(path, { force: true });
                fs.writeFileSync(path, text);
                console.log(`[更新检测] ${file.file}进行了覆盖更新`);
            }

            console.log(`[更新检测] ${file.file}文件更新成功`);
            return true;
        } catch (e) {
            console.log(`[更新检测] ${file.file}文件更新失败: ${e}`);
            return false;
        }
    }

    list(): UpdateFile[] {
        return [];
    }

}
