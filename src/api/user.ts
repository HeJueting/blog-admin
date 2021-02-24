import Axios from '../utils/axios';

// 接口：登录
declare interface IUserLogin {
    userName: string;
    password: string;
}
// 接口：更新用户信息
declare interface IUserUpdate {
    _id: string;
    data: {
        headImg?: string;
        nickName?: string;
        isMale?: boolean;
        constellation?: string;
        birthday?: string;
        city?: string;
        email?: string;
        github?: string;
        company?: string;
        job?: string;
        motto?: string;
        introduction?: string;
        hobby?: string[];
        label?: string[];
        educationRecord?: {
            school: string;
            major: string;
            diploma: string;
            startTime: string;
            endTime: string;
        }[];
        workRecord?: {
            company: string;
            job: string;
            location: string;
            startTime: string;
            endTime: string;
        }[];
        certificateRecord?: {
            name: string;
            number: string;
            time: string;
            key: string;
        }[];
    };
}

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
    updatePass: (data: any) =>
        Axios({
            method: 'post',
            url: '/user/admin/updatePass',
            data,
        }),
};

export default userAxios;
