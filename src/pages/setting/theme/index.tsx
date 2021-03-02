import React, { useEffect, useState } from 'react';
import style from '../style.module.scss';
import Prism from 'prismjs';
import lodash from '../../../utils/lodash';
import CONFIG from '../../../config';
import settingAxios from '../../../api/setting';

import { Button, Modal, Input, message } from 'antd';
import ReactJson from 'react-json-view';
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
    // 博客配置信息
    const [themeConfig, setThemeConfig] = useState<IObj>({});
    // 弹窗
    const [name, setName] = useState<string>('');
    const [obj, setObj] = useState<string>('');
    const [editTheme, setEditTheme] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);
    const [operation, setOperation] = useState<string>('create');

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
    const saveOnClick = async () => {
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
    // 点击新增博客主题
    const createOnClick = () => {
        setEditTheme('');
        setOperation('create');
        setVisible(true);
    };
    // 点击编辑博客主题
    const editOnClick = (key: string) => {
        setEditTheme(key);
        setOperation('edit');
        setObj(JSON.stringify(themeConfig[key]));
        setName(key);
        setVisible(true);
    };
    // 点击删除博客主题
    const deleteOnClick = (key: string) => {
        Modal.confirm({
            title: '是否删除该主题配置？',
            onOk: async () => {
                const newThemeConfig: { [key: string]: any } = {};
                // 筛选出还存在的keys
                const keys = Object.keys(themeConfig).filter(
                    (k: string) => k !== key
                );
                // 遍历这些keys赋值给新的themeConfig
                keys.forEach((k: string) => {
                    newThemeConfig[k] = themeConfig[key];
                });
                // 更新主题配置信息
                setThemeConfig(newThemeConfig);
            },
        });
    };

    // 取消添加、编辑主题配置
    const onCancel = () => {
        setObj('');
        setName('');
        setVisible(false);
    };
    // 确认编辑、添加主题
    const onOk = () => {
        // 判断json解析是否有错
        if (checkObjRight()) {
            if (operation === 'create') {
                themeConfig[name] = JSON.parse(obj);
            } else {
                themeConfig[editTheme] = JSON.parse(obj);
            }
            onCancel();
        } else {
            message.error('json解析错误');
        }
    };

    // 校验obj是否为合格的json数据
    const checkObjRight = () => {
        let isRight;
        try {
            JSON.parse(obj);
            isRight = true;
        } catch (e) {
            isRight = false;
        }
        console.log(isRight);
        return isRight;
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>博客主题配置</h3>
                <div className={style['btn-wrap']}>
                    <Button
                        className={style['btn']}
                        onClick={saveOnClick}
                        type="primary"
                    >
                        保存
                    </Button>
                    <Button onClick={createOnClick} type="primary">
                        新增
                    </Button>
                </div>
            </div>

            {/* 主题 */}
            <div className={style['theme-wrap']}>
                {Object.keys(themeConfig).map((key: string) => (
                    <div className={style['theme-box']} key={key}>
                        <h4>{key}</h4>
                        <div className={style['operate-wrap']}>
                            <span
                                onClick={() => {
                                    editOnClick(key);
                                }}
                            >
                                编辑
                            </span>
                            {key !== 'light' && key !== 'dark' && (
                                <span
                                    onClick={() => {
                                        deleteOnClick(key);
                                    }}
                                >
                                    删除
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 弹窗 */}
            <Modal
                width="80%"
                title={`${operation === 'create' ? '新增' : '编辑'}主题配置`}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <div className={style['themenConfig-modal']}>
                    <Input
                        disabled={name === 'light' || name === 'dark'}
                        className="app-input"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        placeholder="请输入主题名称"
                    />
                    <div className={style['obj-wrap']}>
                        <Input.TextArea
                            style={{ resize: 'none' }}
                            value={obj}
                            placeholder="请添加主题配置信息"
                            onChange={(e) => {
                                try {
                                    JSON.parse(e.target.value);
                                } catch (e) {
                                    message.error(`json解析错误: ${e}`);
                                }
                                setObj(e.target.value);
                            }}
                            rows={16}
                        />
                        {checkObjRight() ? (
                            <div className={style['json-wrap']}>
                                <ReactJson
                                    displayDataTypes={false}
                                    enableClipboard={false}
                                    displayObjectSize={false}
                                    src={JSON.parse(obj)}
                                />
                            </div>
                        ) : (
                            <div className={style['error-json-wrap']}>
                                json解析错误
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Theme;
