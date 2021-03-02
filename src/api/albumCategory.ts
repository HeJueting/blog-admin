import Axios from '../utils/axios';
import {
    IAlbumCategoryCreate,
    IAlbumCategoryDelete,
    IAlbumCategoryUpdate,
} from '../typing/api/albumCategory';

const albumCategoryAxios = {
    // 创建相册分类
    create: (data: IAlbumCategoryCreate) =>
        Axios({
            method: 'post',
            url: '/albumCategory/admin/create',
            data,
        }),
    // 更新相册分类信息
    update: (data: IAlbumCategoryUpdate) =>
        Axios({
            method: 'post',
            url: '/albumCategory/admin/update',
            data,
        }),
    // 删除相册分类
    delete: (params: IAlbumCategoryDelete) =>
        Axios({
            method: 'get',
            url: '/albumCategory/admin/delete',
            params,
        }),
    // 查询相册分类列表
    searchList: () =>
        Axios({
            method: 'get',
            url: '/albumCategory/frontend/list',
        }),
};

export default albumCategoryAxios;
