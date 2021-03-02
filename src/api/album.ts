import Axios from '../utils/axios';
import { IAlbumCreate, IAlbumDelete, IAlbumUpdate } from '../typing/api/album';

const albumAxios = {
    // 创建相册
    create: (data: IAlbumCreate) =>
        Axios({
            method: 'post',
            url: '/album/admin/create',
            data,
        }),
    // 更新相册信息
    update: (data: IAlbumUpdate) =>
        Axios({
            method: 'post',
            url: '/album/admin/update',
            data,
        }),
    // 删除相册信息
    delete: (params: IAlbumDelete) =>
        Axios({
            method: 'get',
            url: '/album/admin/delete',
            params,
        }),
    // 查询相册列表
    searchList: () =>
        Axios({
            method: 'get',
            url: '/album/admin/list',
        }),
};

export default albumAxios;
