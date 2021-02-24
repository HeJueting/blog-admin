import axios from 'axios';

// 对axios返回的response添加参数
declare module 'axios' {
    interface IAxios {
        code: number;
        msg: string;
        data?: any;
        total?: number;
        count?: number;
    }
    export interface AxiosResponse<T = any> extends IAxios {}
}
