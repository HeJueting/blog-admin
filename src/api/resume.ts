import Axios from '../utils/axios';

const resumeAxios = {
    // 查询简历信息
    search: () =>
        Axios({
            method: 'get',
            url: '/resume/admin/search',
        }),
    // 更新简历信息
    update: (data: any) =>
        Axios({
            method: 'post',
            url: '/resume/admin/update',
            data,
        }),
};

export default resumeAxios;
