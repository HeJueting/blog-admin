import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import lodash from '../../../utils/lodash';

// 接口：路由映射
interface IPathMapping {
    [prop: string]: string[];
}

const Tips: React.FC = () => {
    const [tips, setTips] = useState<string[]>([]);
    const location = useLocation();

    useEffect(() => {
        const pathMapping: IPathMapping = {
            '/user/flow': ['个人中心', '流量统计'],
            '/user/active': ['个人中心', '活跃指数'],
            '/user/info': ['个人中心', '用户信息'],
            '/user/cloud': ['个人中心', '云端资源'],
            '/user/resume': ['个人中心', '我的简历'],
            '/article/list': ['我的文章', '文章列表'],
            '/article/category': ['我的文章', '文章分类'],
            '/article/edit': ['我的文章', '文章编辑'],
            '/article/recycle': ['我的文章', '回收站'],
            '/album/list': ['相册集', '相册管理'],
            '/album/detail': [
                '相册集',
                '相册管理',
                lodash.get(location, 'query.name', ''),
            ],
            '/album/category': ['相册集', '相册分类'],
            '/record/list': ['生活记录', '生活列表'],
            '/record/edit': ['生活记录', '生活编辑'],
            '/comment/list': ['评论', '评论列表'],
            '/setting/test': ['设置', '测试'],
            '/setting/index': ['设置', '博客配置'],
        };
        setTips(lodash.get(pathMapping, 'location.pathname', []));
    }, [location]);

    return (
        <div className={style['router-tips']}>
            {tips.map((item) => (
                <div className={style['tips-item']} key={`router-tips-${item}`}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default Tips;
