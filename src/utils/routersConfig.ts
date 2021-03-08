/*
 *  folderName: page目录下的文件名，用于异步组件加载（代码分割）
 *  path: react-router的路由
 *  title: 路由名称
 *  icon: 导航栏中展示的路由Icon
 *  hidden: 是否展示该路由，如果设置为true，导航栏中不会展示
 */

export default [
    // 个人中心
    {
        folderName: 'userFlow',
        path: '/user/flow',
        title: '流量统计',
        icon: 'icon-broadcast-fill',
    },
    {
        folderName: 'userActive',
        path: '/user/active',
        title: '活跃指数',
        icon: 'icon-bar-chart-fill',
    },
    {
        folderName: 'userInfo',
        path: '/user/info',
        title: '用户信息',
        icon: 'icon-personal-info',
    },
    {
        folderName: 'userResume',
        path: '/user/resume',
        title: '在线简历',
        icon: 'icon-icresume',
    },
    {
        folderName: 'userCloud',
        path: '/user/cloud',
        title: '云端资源',
        icon: 'icon-cloud-fill',
    },
    // 我的文章
    {
        folderName: 'articleList',
        path: '/article/list',
        title: '文章列表',
        icon: 'icon-chazhaobiaodanliebiao',
    },
    {
        folderName: 'articleCategory',
        path: '/article/category',
        title: '文章分类',
        icon: 'icon-leimupinleifenleileibie2',
    },
    {
        folderName: 'articleEdit',
        path: '/article/edit',
        title: '文章编辑',
        icon: 'icon-draft-fill',
    },
    {
        folderName: 'articleRecycle',
        path: '/article/recycle',
        title: '回收站',
        icon: 'icon-delete',
    },
    // 相册集
    {
        folderName: 'albumList',
        path: '/album/list',
        title: '相册列表',
        icon: 'icon-guanli',
    },
    {
        folderName: 'albumCategory',
        path: '/album/category',
        title: '相册分类',
        icon: 'icon-leimupinleifenleileibie2',
    },
    {
        folderName: 'albumDetail',
        path: '/album/detail',
        title: '相册详情',
        hidden: true,
    },
    // 生活记录
    {
        folderName: 'recordList',
        path: '/record/list',
        title: '生活列表',
        icon: 'icon-chazhaobiaodanliebiao',
    },
    {
        folderName: 'recordEdit',
        path: '/record/edit',
        title: '生活编辑',
        icon: 'icon-edit',
    },
    // 评论
    {
        folderName: 'commentList',
        path: '/comment/list',
        title: '评论列表',
        icon: 'icon-chazhaobiaodanliebiao',
    },
    // 设置
    {
        folderName: 'setting',
        path: '/setting/index',
        title: '博客配置',
        icon: 'icon-shezhi',
    },
];
