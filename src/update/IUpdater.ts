export interface IUpdater {
    /** 获取Updater需要下载的文件列表 */
    list(): UpdateFile[];
    /** 获取远程地址 */
    remote(file: UpdateFile): string;
    /** 更新指定文件的方式, 返回是否成功 */
    update(file: UpdateFile): Promise<boolean>;
}

export interface UpdateFile {
    file: string;
    /** 是否覆盖 默认为true */
    overwrite?: boolean;
}
