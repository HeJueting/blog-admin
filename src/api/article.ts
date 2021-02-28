import Axios from '../utils/axios';
import {
    IArticleList,
    IArticleCreate,
    IArticleUpdate,
    IArticleDelete,
    IArticleDestroy,
} from '../typing/api/article';

const articleAxios = {
    // 查询文章列表
    list: (data: IArticleList) =>
        Axios({
            method: 'post',
            url: '/article/admin/list',
            data,
        }),
    // 创建一篇文章
    create: (data: IArticleCreate) =>
        Axios({
            method: 'post',
            url: '/article/admin/create',
            data,
        }),
    // 更新一篇文章
    update: (data: IArticleUpdate) =>
        Axios({
            method: 'post',
            url: '/article/admin/update',
            data,
        }),
    // 删除一篇文章（不删除数据库）
    delete: (params: IArticleDelete) =>
        Axios({
            method: 'get',
            url: '/article/admin/delete',
            params,
        }),
    // 清除一篇文章（数据库删除）
    destroy: (params: IArticleDestroy) =>
        Axios({
            method: 'get',
            url: '/article/admin/destroy',
            params,
        }),
};

export default articleAxios;
