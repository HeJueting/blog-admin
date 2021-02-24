import Axios from '../utils/axios';

// 接口：create
interface ICreate {
    time: number;
    name: string;
    lat: string;
    lng: string;
}
// 接口：update
interface IUpdate {
    id: string;
    data: {
        time: number;
        name: string;
        lat: string;
        lng: string;
    };
}
// 接口：detele
interface IDelete {
    id: string;
}

const locationAxios = {
    // 获取所有拍摄地点
    search: () =>
        Axios({
            method: 'get',
            url: '/location/frontend/list',
        }),
    // 新增拍摄地点
    create: (data: ICreate) =>
        Axios({
            method: 'post',
            url: '/location/admin/create',
            data,
        }),
    // 新增拍摄地点
    update: (data: IUpdate) =>
        Axios({
            method: 'post',
            url: '/location/admin/update',
            data,
        }),
    // 删除拍摄地点
    delete: (params: IDelete) =>
        Axios({
            method: 'get',
            url: '/location/admin/delete',
            params,
        }),
};

export default locationAxios;
