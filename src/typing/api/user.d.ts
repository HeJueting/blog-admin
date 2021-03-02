// 登录
export interface IUserLogin {
    userName: string;
    password: string;
}

// 更新用户信息
export interface IUserUpdate {
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

// 修改密码
export interface IUserUpdatePass {
    code: string;
    pass: string;
}
