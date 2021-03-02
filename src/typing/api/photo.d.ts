// 查询相册的照片列表
export interface IPhotoSearchList {
    albumId: string;
}

// 删除照片
export interface IPhotoDelete {
    _id: string;
    url: string;
}
