import fs from "fs";
import path from "path";

export function readFilesRecursive(directory: string, handler: (filePath: string) => void) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readFilesRecursive(filePath,handler); // 递归读取子目录
        } else {
            // 处理文件
            //console.log(filePath)
            handler(filePath)
        }
    });
}

export function getFilesRecursively(directory) {
    let files = [];
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            files = files.concat(getFilesRecursively(absolute));
        } else {
            files.push(absolute);
        }
    }
    return files;
}
