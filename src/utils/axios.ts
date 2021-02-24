import axios from 'axios';
import CONFIG from '../config';
import lodash from './lodash';
import localForage from 'localforage';
import { showLoading, hiddenLoading } from './help';

// 创建axios实例
const Axios = axios.create({
    baseURL: CONFIG.REQUEST_BASE_URL,
    timeout: 5000,
});

// request拦截器
Axios.interceptors.request.use(
    async (config) => {
        // 展示loading
        showLoading();
        // 深复制config
        const newConfig = lodash.cloneDeep(config);
        // 携带Authorization认证
        const token = await localForage.getItem('token');
        newConfig.headers.Authorization = `Bearer ${token}`;
        return newConfig;
    },
    (error) => {
        // 全局报错提示
        window.$message.error(String(error));
        return Promise.reject(error);
    }
);

// response拦截器
Axios.interceptors.response.use(
    (response) => {
        // loading消失
        hiddenLoading();
        // 响应结果
        const res = response.data;
        if (res.code !== 0) {
            // 全局报错提示
            window.$message.error(res.msg);
            return Promise.reject(res.msg);
        }
        return res;
    },
    (error) => {
        // loading消失
        hiddenLoading();
        // 全局报错提示
        window.$message.error(String(error));
        return Promise.reject(error);
    }
);

export default Axios;
