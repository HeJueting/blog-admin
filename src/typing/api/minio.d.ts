// 创建存储桶
export interface ICreateBucket {
    name: string;
    purview: number;
    password: string;
}

// 删除存储桶
export interface IDeleteBucket {
    name: string;
}

// 更新存储桶
export interface IUpdateBucket {
    name: string;
    purview: number;
    password: string;
}

// 获取文件信息
export interface ISearchBucketObjects {
    bucketName: string;
    prefix: string;
}

// 删除文件夹
export interface IDeleteFolder {
    name: string;
    prefix: string;
}

// 删除文件对象
interface IDeleteFile {
    bucketName: string;
    objectName: string;
}
