import Axios from '../utils/axios';

// 接口：创建分类
interface ICreate {
    description: string;
    isPublic: boolean;
    name: string;
    parentId: string;
}
// 接口：更新分类
interface IUpdate {
    _id: string;
    description?: string;
    isPublic?: boolean;
    name?: string;
    parentId?: string;
    sort?: number;
}
// 接口：删除分类
interface IDelete {
    _id: string;
}

const articleCategoryAxios = {
    // 创建分类
    create: (data: ICreate) =>
        Axios({
            method: 'post',
            url: '/articleCategory/admin/create',
            data,
        }),
    // 更新分类
    update: (data: IUpdate) =>
        Axios({
            method: 'post',
            url: '/articleCategory/admin/update',
            data,
        }),
    // 删除分类
    delete: (params: IDelete) =>
        Axios({
            method: 'get',
            url: '/articleCategory/admin/delete',
            params,
        }),
    // 查询分类列表信息
    list: () =>
        Axios({
            method: 'get',
            url: '/articleCategory/admin/list',
        }),
};

export default articleCategoryAxios;
