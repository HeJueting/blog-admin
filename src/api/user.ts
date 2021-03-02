import Axios from '../utils/axios';
import { IUserLogin, IUserUpdate, IUserUpdatePass } from '../typing/api/user';

const userAxios = {
    // 登录
    login: (data: IUserLogin) =>
        Axios({
            method: 'post',
            url: '/user/frontend/login',
            data,
        }),
    // 获取用户信息
    getUserInfo: () =>
        Axios({
            method: 'get',
            url: '/user/admin/info',
        }),
    // 更新用户信息
    updateUserInfo: (data: IUserUpdate) =>
        Axios({
            method: 'post',
            url: '/user/admin/update',
            data,
        }),
    // 重置新消息
    resetNews: () =>
        Axios({
            method: 'get',
            url: '/user/admin/resetNews',
        }),
    // 发送验证码
    sendVerifyCode: () =>
        Axios({
            method: 'get',
            url: '/user/frontend/sendVerifyCode',
        }),
    // 修改密码
    updatePass: (data: IUserUpdatePass) =>
        Axios({
            method: 'post',
            url: '/user/admin/updatePass',
            data,
        }),
};

export default userAxios;
