import Axios from '../utils/axios';
import { IErrorCollect } from '../typing/api/error';

const errorAxios = {
    // 收集错误日志
    collect: (data: IErrorCollect) =>
        Axios({
            method: 'post',
            url: '/error/frontend/collect',
            data: {
                msg: data.msg,
                type: 'web-admin-log',
            },
        }),
};

export default errorAxios;
