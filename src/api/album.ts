import Axios from '../utils/axios';

// 接口：创建相册
interface ICreate {
    bacImg: string;
    categoryId: string;
    description: string;
    location: string;
    name: string;
    password: number;
    purview: 0;
}
// 接口：更新相册
interface IUpdate {
    bacImg?: string;
    description?: string;
    location?: string;
    name?: string;
    password?: string;
    purview?: number;
    _id: string;
}
// 接口：删除相册
interface IDelete {
    _id: string;
}

const albumAxios = {
    // 创建相册
    create: (data: ICreate) =>
        Axios({
            method: 'post',
            url: '/album/admin/create',
            data,
        }),
    // 更新相册信息
    update: (data: IUpdate) =>
        Axios({
            method: 'post',
            url: '/album/admin/update',
            data,
        }),
    // 删除相册信息
    delete: (params: IDelete) =>
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
