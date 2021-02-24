import Axios from '../utils/axios';

// 接口：查询评论
interface ISearch {
    keyword: string;
    page: number;
    pageSize: number;
    sort: number;
    category?: number;
}
// 接口：删除评论
interface IDelete {
    _id: string;
}

const commentAxios = {
    // 查询评论条数
    searchCommentList: (data: ISearch) =>
        Axios({
            method: 'post',
            url: '/comment/admin/list',
            data,
        }),
    // 删除评论
    delete: (params: IDelete) =>
        Axios({
            method: 'get',
            url: '/comment/admin/delete',
            params,
        }),
};

export default commentAxios;
