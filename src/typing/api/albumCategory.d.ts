// 创建相册分类
export interface IAlbumCategoryCreate {
    description: string;
    name: string;
}

// 更新相册分类
export interface IAlbumCategoryUpdate {
    description?: string;
    sort?: number;
    name?: string;
    _id: string;
}

// 删除删除分类
export interface IAlbumCategoryDelete {
    _id: string;
}
