import React, { useState, useEffect } from 'react';
import settingAxios from '../../api/setting';

import HomePageImage from './homePageImage';
import Links from './links';
import Locations from './locations';
import CarouselImage from './carsouelImage';
import CommentHeaderImg from './commentHeaderImg';
import Theme from './theme';

const Setting: React.FC = () => {
    // 设置表的_id
    const [settingRes, setSettingRes] = useState<any>({});

    // 初始化页面数据
    const initData = async () => {
        const res = await settingAxios.search();
        setSettingRes(res);
    };
    useEffect(() => {
        initData();
    }, []);

    return (
        <>
            <HomePageImage data={settingRes.data} />
            <CarouselImage data={settingRes.data} />
            <Links data={settingRes.data} />
            <Locations />
            <CommentHeaderImg data={settingRes.data} />
            <Theme data={settingRes.data} />
        </>
    );
};

export default Setting;
