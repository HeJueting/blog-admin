import React, { useState, useEffect } from 'react';
import routerConfig from '../../utils/routersConfig';

import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../icon';

// 接口：router路由
interface IRouterItem {
    folderName: string;
    path: string;
    title: string;
    icon?: string;
    hidden?: boolean;
}
// 接口：菜单
interface IMenuItem {
    children: IRouterItem[];
    key: string;
    title: string;
    icon: string;
}

const NavBar: React.FC = () => {
    // 菜单项
    const rootMenus = [
        {
            title: '个人中心',
            icon: 'icon-user',
            key: 'user',
            children: [],
        },
        {
            title: '我的文章',
            icon: 'icon-book',
            key: 'article',
            children: [],
        },
        {
            title: '相册集',
            icon: 'icon-LC_icon_photo_fill',
            key: 'album',
            children: [],
        },
        {
            title: '生活记录',
            icon: 'icon-kafei',
            key: 'record',
            children: [],
        },
        {
            title: '评论',
            icon: 'icon-tubiaozhizuo-',
            key: 'comment',
            children: [],
        },
        {
            title: '设置',
            icon: 'icon-shezhi',
            key: 'setting',
            children: [],
        },
    ];
    // icon样式
    const iconStyle = {
        marginRight: '1vw',
        fontSize: '1.6rem',
    };
    const [menus, setMenus] = useState<IMenuItem[]>([]);
    const location = useLocation();

    // 初始化菜单路由
    useEffect(() => {
        // 遍历rootMenus，组装他的children
        rootMenus.forEach((item: IMenuItem) => {
            const childRouters: IRouterItem[] = routerConfig.filter(
                (router) =>
                    router.path.indexOf(item.key) !== -1 && !router.hidden
            );
            item.children = childRouters;
        });
        setMenus(rootMenus);
    }, []);

    return (
        <Menu
            theme="dark"
            defaultOpenKeys={['user']}
            selectedKeys={[location.pathname]}
            mode="inline"
        >
            {menus.map((option) => (
                <Menu.SubMenu
                    key={option.key}
                    title={option.title}
                    icon={<Icon type={option.icon} style={iconStyle} />}
                >
                    {option.children.map((item) => (
                        <Menu.Item key={item.path}>
                            <Link to={item.path}>
                                <Icon
                                    type={item.icon as string}
                                    style={iconStyle}
                                />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            ))}
        </Menu>
    );
};

export default NavBar;
