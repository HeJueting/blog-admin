import React, { useEffect, useState } from 'react';
import style from '../style.module.scss';
import lodash from '../../../utils/lodash';
import CONFIG from '../../../config';
import settingAxios from '../../../api/setting';

import { Button, Modal } from 'antd';
import Upload from '../../../components/upload';
import Icon from '../../../components/icon';

// 接口：props
interface IObj {
    [key: string]: any;
}
interface ICarsouelImageProps {
    data: {
        _id: string;
        themeConfig: IObj;
    };
}

const Theme: React.FC<ICarsouelImageProps> = ({ data }) => {
    const [themeConfig, setThemeConfig] = useState<IObj>({});

    // 初始化页面数据
    const initData = () => {
        if (data) {
            setThemeConfig(data.themeConfig);
        }
    };
    useEffect(() => {
        initData();
    }, [data]);

    // 点击保存（博客首页）
    const save = async () => {
        const res = await settingAxios.update({
            _id: data._id,
            data: {
                themeConfig,
            },
        });
        if (res.code === 0) {
            window.$message.success('保存成功');
        }
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>博客主题配置</h3>
                <div className={style['btn-wrap']}>
                    <Button
                        className={style['btn']}
                        onClick={save}
                        type="primary"
                    >
                        保存
                    </Button>
                    <Button onClick={save} type="primary">
                        新增
                    </Button>
                </div>
            </div>

            {/* 主题 */}
            <div className={style['theme-wrap']}>
                <div className={style['theme-box']}>
                    <h4>dark</h4>
                    <div className={style['operate-wrap']}>
                        <span>编辑</span>
                        <span>删除</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Theme;
