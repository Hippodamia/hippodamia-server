import { HippodamiaUpdater } from "./HippodamiaUpdater";
import { UpdateFile } from "./IUpdater";


export class RandomEventUpdater extends HippodamiaUpdater {
    list(): UpdateFile[] {
        return [
            { file: '/config/scripts/random_events/114514.js' },
            { file: '/config/scripts/random_events/wohoo.js' },
            { file: '/config/scripts/random_events/developer_heer.js' },
            { file: '/config/scripts/README.md' },
        ];
    }
}

export class LanguagesUpdater extends HippodamiaUpdater {
    list(): UpdateFile[] {
        return [
            { file: '/config/languages/zh_cn_default.lang' }
        ]; 
    }
}

export class ServerSettingsUpdater extends HippodamiaUpdater {
    list(): UpdateFile[] {
        return [
            { file: '/config/settings.json', overwrite: false }
        ];
    }
} 
