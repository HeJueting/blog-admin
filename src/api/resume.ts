import Axios from '../utils/axios';
import { IResumeUpdate } from '../typing/api/resume';

const resumeAxios = {
    // 查询简历信息
    search: () =>
        Axios({
            method: 'get',
            url: '/resume/frontend/search',
        }),
    // 更新简历信息
    update: (data: IResumeUpdate) =>
        Axios({
            method: 'post',
            url: '/resume/admin/update',
            data,
        }),
};

export default resumeAxios;
