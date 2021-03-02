import Axios from '../utils/axios';
import {
    ILocationCreate,
    ILocationUpdate,
    ILocationDelete,
} from '../typing/api/location';

const locationAxios = {
    // 获取所有拍摄地点
    search: () =>
        Axios({
            method: 'get',
            url: '/location/frontend/list',
        }),
    // 新增拍摄地点
    create: (data: ILocationCreate) =>
        Axios({
            method: 'post',
            url: '/location/admin/create',
            data,
        }),
    // 新增拍摄地点
    update: (data: ILocationUpdate) =>
        Axios({
            method: 'post',
            url: '/location/admin/update',
            data,
        }),
    // 删除拍摄地点
    delete: (params: ILocationDelete) =>
        Axios({
            method: 'get',
            url: '/location/admin/delete',
            params,
        }),
};

export default locationAxios;
