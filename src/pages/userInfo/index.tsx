import React, { useState } from 'react';
import style from './style.module.scss';
import { Tabs } from 'antd';

// 代码分割
const Basic = React.lazy(() => import('./basic'));
const Other = React.lazy(() => import('./other'));

const UserInfo: React.FC = () => {
    const [tabKey, setTabKey] = useState('basic');

    const tabChange = (key: string) => {
        if (key !== tabKey) {
            setTabKey(key);
        }
    };

    return (
        <div className={style['user-info']}>
            <Tabs
                defaultActiveKey="basic"
                activeKey={tabKey}
                onChange={tabChange}
            >
                <Tabs.TabPane tab="基本资料" key="basic">
                    <React.Suspense fallback={null}>
                        <Basic />
                    </React.Suspense>
                </Tabs.TabPane>
                <Tabs.TabPane tab="其他信息" key="other">
                    <React.Suspense fallback={null}>
                        <Other />
                    </React.Suspense>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default UserInfo;
