import Axios from '../utils/axios';

const photoAxios = {
    // 查询相册的照片列表
    searchList: (params: any) =>
        Axios({
            method: 'get',
            url: '/photo/admin/list',
            params,
        }),
    // 删除照片
    delete: (params: any) =>
        Axios({
            method: 'get',
            url: '/photo/admin/delete',
            params,
        }),
};

export default photoAxios;
