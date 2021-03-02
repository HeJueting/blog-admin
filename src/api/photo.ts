import Axios from '../utils/axios';
import { IPhotoSearchList, IPhotoDelete } from '../typing/api/photo';

const photoAxios = {
    // 查询相册的照片列表
    searchList: (params: IPhotoSearchList) =>
        Axios({
            method: 'get',
            url: '/photo/admin/list',
            params,
        }),
    // 删除照片
    delete: (params: IPhotoDelete) =>
        Axios({
            method: 'get',
            url: '/photo/admin/delete',
            params,
        }),
};

export default photoAxios;
