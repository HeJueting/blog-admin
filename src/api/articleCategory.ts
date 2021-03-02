import Axios from '../utils/axios';
import {
    IArticleCategoryCreate,
    IArticleCategoryDelete,
    IArticleCategoryUpdate,
} from '../typing/api/articleCategory';

const articleCategoryAxios = {
    // 创建分类
    create: (data: IArticleCategoryCreate) =>
        Axios({
            method: 'post',
            url: '/articleCategory/admin/create',
            data,
        }),
    // 更新分类
    update: (data: IArticleCategoryUpdate) =>
        Axios({
            method: 'post',
            url: '/articleCategory/admin/update',
            data,
        }),
    // 删除分类
    delete: (params: IArticleCategoryDelete) =>
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
