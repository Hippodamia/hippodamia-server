import { resolve } from "path";
import fs from "fs";
import { dirname } from "path";
import { IUpdater, UpdateFile } from "./IUpdater";


export abstract class HippodamiaUpdater implements IUpdater {

    remote(file: UpdateFile): string {
        return 'https://gitee.com/heerkaisair/hippodamia-server/raw/main' + (file.file.startsWith('/') ? '' : '/') + file;
    }

    async update(file: UpdateFile): Promise<boolean> {
        if (file.overwrite == undefined) {
            file.overwrite = true;
        }
        try {
            const path = resolve('.' + file);
            const resp = await fetch(this.remote(file));
            if (!resp.ok) {
                console.log(`[更新检测] 无法获取${file}文件, 请检查网络连接或稍后再试`);
                return false;
            }

            const dir = dirname(path);
            fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });


            // overwrite
            if (fs.existsSync(path) && file.overwrite === true) {
                fs.rmSync(path, { force: true });
                fs.writeFileSync(path, await resp.text());
            }

            console.log(`[更新检测] ${file}文件更新成功`);
            return true;
        } catch (e) {
            console.log(`[更新检测] ${file}文件更新失败: ${e}`);
            return false;
        }
    }

    list(): UpdateFile[] {
        return [];
    }

}
