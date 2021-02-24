import Axios from '../utils/axios';

// 接口：查询文章列表
interface IList {
    keyword?: string;
    page?: number;
    pageSize?: number;
    sort?: string | number;
    state?: string | number;
    category?: string;
}
// 接口：创建文章
interface ICreate {
    abstract: string;
    bacImg: string;
    categoryId: string;
    createAt: number | string;
    html: string;
    password: string;
    purview: number;
    state: number;
    tags: string[];
    title: string;
}
// 接口：更新文章
interface IUpdate {
    _id: string;
    nickName?: string;
    birthday?: string;
    city?: string;
    company?: string;
    constellation?: string;
    email?: string;
    github?: string;
    headImg?: string;
    introduction?: string;
    isMale?: boolean;
    job?: string;
    motto?: string;
    label?: string[];
    hobby?: string[];
    sort?: number;
    state?: number;
    createAt?: number | string;
    modifyAt?: number;
}
// 接口：删除文章
interface IDelete {
    _id: string;
}
// 接口：彻底删除一篇文章
interface IDestroy {
    _id: string;
}

const articleAxios = {
    // 查询文章列表
    list: (data: IList) =>
        Axios({
            method: 'post',
            url: '/article/admin/list',
            data,
        }),
    // 创建一篇文章
    create: (data: ICreate) =>
        Axios({
            method: 'post',
            url: '/article/admin/create',
            data,
        }),
    // 更新一篇文章
    update: (data: IUpdate) =>
        Axios({
            method: 'post',
            url: '/article/admin/update',
            data,
        }),
    // 删除一篇文章
    delete: (params: IDelete) =>
        Axios({
            method: 'get',
            url: '/article/admin/delete',
            params,
        }),
    // 删除一篇文章
    destroy: (params: IDestroy) =>
        Axios({
            method: 'get',
            url: '/article/admin/destroy',
            params,
        }),
};

export default articleAxios;
