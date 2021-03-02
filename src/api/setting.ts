import Axios from '../utils/axios';
import { ISettingUpdate } from '../typing/api/setting';

const settingAxios = {
    // 获取设置信息
    search: () =>
        Axios({
            method: 'get',
            url: '/setting/frontend/search',
        }),
    // 更新设置
    update: (data: ISettingUpdate) =>
        Axios({
            method: 'post',
            url: '/setting/admin/update',
            data,
        }),
};

export default settingAxios;
