import Axios from '../utils/axios';

// 创建
interface Icreate {
    description: string;
    name: string;
}
// 更新
interface IUpdate {
    description?: string;
    sort?: number;
    name?: string;
    _id: string;
}
// 删除
interface IDelete {
    _id: string;
}

const albumCategoryAxios = {
    // 创建相册分类
    create: (data: Icreate) =>
        Axios({
            method: 'post',
            url: '/albumCategory/admin/create',
            data,
        }),
    // 更新相册分类信息
    update: (data: IUpdate) =>
        Axios({
            method: 'post',
            url: '/albumCategory/admin/update',
            data,
        }),
    // 删除相册分类
    delete: (params: IDelete) =>
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
