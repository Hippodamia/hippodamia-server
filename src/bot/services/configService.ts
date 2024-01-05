import * as fs from 'fs';
import {Shop} from "../../types";

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
    return readJsonFiles('./config/shops');
}
