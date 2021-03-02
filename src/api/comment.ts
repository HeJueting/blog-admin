import Axios from '../utils/axios';
import { ICommentDelete, ICommentSearch } from '../typing/api/comment';

const commentAxios = {
    // 查询评论条数
    searchCommentList: (data: ICommentSearch) =>
        Axios({
            method: 'post',
            url: '/comment/admin/list',
            data,
        }),
    // 删除评论
    delete: (params: ICommentDelete) =>
        Axios({
            method: 'get',
            url: '/comment/admin/delete',
            params,
        }),
};

export default commentAxios;
