// 更新简历信息
export interface IResumeUpdate {
    _id: string;
    data: {
        content: string;
        password: string;
        isPublic: boolean;
    };
}
