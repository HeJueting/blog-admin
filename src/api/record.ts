import Axios from '../utils/axios';

const recordAxios = {
    // 获取生活记录列表
    list: (data: any) =>
        Axios({
            method: 'post',
            url: '/record/frontend/list',
            data,
        }),
    // 创建生活记录
    create: (data: any) =>
        Axios({
            method: 'post',
            url: '/record/admin/create',
            data,
        }),
    // 更新生活记录
    update: (data: any) =>
        Axios({
            method: 'post',
            url: '/record/admin/update',
            data,
        }),
    // 删除生活记录
    delete: (params: any) =>
        Axios({
            method: 'get',
            url: '/record/admin/delete',
            params,
        }),
};

export default recordAxios;
