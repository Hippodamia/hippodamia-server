import * as fs from 'node:fs';
import {Shop} from "@/types";
import path from 'node:path';

const readJsonFiles = (directory: string): any[] => {
    const files = fs.readdirSync(directory);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));
    const data = [];

    for (const file of jsonFiles) {
        const filePath = `${directory}/${file}`;
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(jsonData);
        data.push(parsedData);
    }

    return data;
};

export function readShops():Shop[]{
    return readJsonFiles(path.resolve('./config/shops'));
}
