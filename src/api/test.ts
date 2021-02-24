import Axios from '../utils/axios';

const testAxios = {
    // 创建评论
    createComment: (data: any) =>
        Axios({
            method: 'post',
            url: '/comment/frontend/create',
            data,
        }),
    // 查询评论条数
    searchCommentList: (data: any) =>
        Axios({
            method: 'post',
            url: '/comment/admin/list',
            data,
        }),
    // 文章浏览数量+1
    articleAddLook: (params: any) =>
        Axios({
            method: 'get',
            url: '/article/frontend/addLook',
            params,
        }),
    // 文章点赞数量+1
    articleAddGood: (params: any) =>
        Axios({
            method: 'get',
            url: '/article/frontend/addGood',
            params,
        }),
    // 新增拍摄地点
    createLocation: (data: any) =>
        Axios({
            method: 'post',
            url: '/location/admin/create',
            data,
        }),
    // 发送邮件
    sendEmail: (data: any) =>
        Axios({
            method: 'post',
            url: '/email/frontend/send',
            data,
        }),
};

export default testAxios;
