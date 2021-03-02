import Axios from '../utils/axios';
import {
    ICreateBucket,
    IDeleteBucket,
    IUpdateBucket,
    ISearchBucketObjects,
    IDeleteFolder,
    IDeleteFile,
} from '../typing/api/minio';

const minioAxios = {
    // 创建存储桶
    createBucket: (data: ICreateBucket) =>
        Axios({
            method: 'post',
            url: '/minio/admin/createBucket',
            data,
        }),
    // 删除存储桶
    deleteBucket: (params: IDeleteBucket) =>
        Axios({
            method: 'get',
            url: '/minio/admin/deleteBucket',
            params,
        }),
    // 查询存储桶
    searchBucket: () =>
        Axios({
            method: 'get',
            url: '/minio/admin/searchBucket',
        }),
    // 更新存储桶
    updateBucket: (data: IUpdateBucket) =>
        Axios({
            method: 'post',
            url: '/minio/admin/updateBucket',
            data,
        }),
    // 获取文件信息
    searchBucketObjects: (params: ISearchBucketObjects) =>
        Axios({
            method: 'get',
            url: '/minio/admin/searchBucketObjects',
            params,
        }),
    // 删除文件夹
    deleteFolder: (params: IDeleteFolder) =>
        Axios({
            method: 'get',
            url: '/minio/admin/deleteFolder',
            params,
        }),
    // 删除文件对象
    deleteFile: (params: IDeleteFile) =>
        Axios({
            method: 'get',
            url: '/minio/admin/deleteFile',
            params,
        }),
    // mongodb数据与minio中的存储桶信息同步
    asyncBucket: () =>
        Axios({
            method: 'get',
            url: '/minio/admin/asyncBucket',
        }),
};

export default minioAxios;
