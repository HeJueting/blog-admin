// 查询生活记录列表
export interface IRecordList {
    sort: number;
    keyword: string;
    page: number;
    pageSize: number;
}

// 创建生活记录
export interface IRecordCreate {
    title: string;
    time: number;
    content: string;
    abstract: string;
}

// 更新生活记录
export interface IRecordUpdate {
    _id: string;
    title: string;
    time: number;
    content: string;
    abstract: string;
}

// 删除生活记录
export interface IRecordDelete {
    _id: string;
}
