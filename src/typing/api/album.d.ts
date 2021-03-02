// 创建相册
export interface IAlbumCreate {
    bacImg: string;
    categoryId: string;
    description: string;
    location: string;
    name: string;
    password: number;
    purview: 0;
}

// 更新相册
export interface IAlbumUpdate {
    bacImg?: string;
    description?: string;
    location?: string;
    name?: string;
    password?: string;
    purview?: number;
    _id: string;
}

// 删除相册
export interface IAlbumDelete {
    _id: string;
}
