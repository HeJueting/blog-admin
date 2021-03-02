// 查询评论
export interface ICommentSearch {
    keyword: string;
    page: number;
    pageSize: number;
    sort: number;
    category?: number;
}

// 删除评论
export interface ICommentDelete {
    _id: string;
}
