import Axios from '../utils/axios';
import {
    IRecordList,
    IRecordCreate,
    IRecordUpdate,
    IRecordDelete,
} from '../typing/api/record';

const recordAxios = {
    // 获取生活记录列表
    list: (data: IRecordList) =>
        Axios({
            method: 'post',
            url: '/record/admin/list',
            data,
        }),
    // 创建生活记录
    create: (data: IRecordCreate) =>
        Axios({
            method: 'post',
            url: '/record/admin/create',
            data,
        }),
    // 更新生活记录
    update: (data: IRecordUpdate) =>
        Axios({
            method: 'post',
            url: '/record/admin/update',
            data,
        }),
    // 删除生活记录
    delete: (params: IRecordDelete) =>
        Axios({
            method: 'get',
            url: '/record/admin/delete',
            params,
        }),
};

export default recordAxios;
