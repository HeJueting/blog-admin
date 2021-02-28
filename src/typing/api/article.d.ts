// 查询文章列表
export interface IArticleList {
    page: number;
    pageSize: number;
    state: string | number;
    keyword?: string;
    sort?: string | number;
    categoryId?: string;
}

// 创建文章
interface IArticleCreate {
    abstract: string;
    bacImg: string;
    categoryId: string;
    createAt: number | string;
    html: string;
    password: string;
    purview: number;
    state: number;
    tags: string[];
    title: string;
}

// 更新文章
interface IArticleUpdate {
    _id: string;
    nickName?: string;
    birthday?: string;
    city?: string;
    company?: string;
    constellation?: string;
    email?: string;
    github?: string;
    headImg?: string;
    introduction?: string;
    isMale?: boolean;
    job?: string;
    motto?: string;
    label?: string[];
    hobby?: string[];
    sort?: number;
    state?: number;
    createAt?: number | string;
    modifyAt?: number;
}

// 删除文章（数据库不删除）
interface IArticleDelete {
    _id: string;
}

//清除文章（数据库删除）
interface IArticleDestroy {
    _id: string;
}
