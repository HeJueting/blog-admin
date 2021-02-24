import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import Prism from 'prismjs';
import resumeAxios from '../../api/resume';
import lodash from '../../utils/lodash';

import { Input, Button, Switch, Modal } from 'antd';
import Editor from '../../components/editor';
import Icon from '../../components/icon';

// 接口
interface IDefaultData {
    content: string;
    password: string;
    isPublic: boolean;
}

const UserResume: React.FC = () => {
    // state
    const [resumeId, setResumeId] = useState('');
    const [isPreview, setIsPreview] = useState(true);
    const [html, setHtml] = useState('');
    const [password, setPassword] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [defaultData, setDefaultData] = useState<IDefaultData>(
        {} as IDefaultData
    );
    // 渲染html的div
    const htmlContentRef = useRef<HTMLDivElement | null>(null);

    // 初始化简历信息
    const initResumeData = async () => {
        const res = await resumeAxios.search();
        if (res.code === 0) {
            setResumeId(res.data._id);
            setHtml(res.data.content);
            setPassword(res.data.password);
            setIsPublic(res.data.isPublic);
            setDefaultData(res.data);
            setIsPreview(true);
            process.nextTick(() => {
                Prism.highlightAll();
            });
            // 拿到锚点的元素
            // this.htmlContent.current.querySelectorAll('h1')[0].id
        }
    };
    useEffect(() => {
        initResumeData();
    }, []);

    // 检测内容是否有修改
    const checkIsChange = () => {
        return !lodash.isEqual(
            {
                html: defaultData.content,
                password: defaultData.password,
                isPublic: defaultData.isPublic,
            },
            {
                html,
                password,
                isPublic,
            }
        );
    };

    // 点击保存
    const save = async () => {
        if (checkIsChange()) {
            const res = await resumeAxios.update({
                _id: resumeId,
                data: {
                    content: html,
                    password,
                    isPublic,
                },
            });
            if (res.code === 0) {
                initResumeData();
                window.$message.success(res.msg);
            }
        } else {
            window.$message.warn('未检测到任何修改');
        }
    };

    // 点击编辑
    const edit = () => {
        setIsPreview(false);
    };

    // 点击取消
    const cancel = () => {
        if (checkIsChange()) {
            Modal.confirm({
                title: '检测到简历内容有更改, 是否放弃修改？',
                onOk: () => {
                    setIsPreview(true);
                    setHtml(defaultData.content);
                    setPassword(defaultData.password);
                    setIsPublic(defaultData.isPublic);
                    process.nextTick(() => {
                        Prism.highlightAll();
                    });
                },
            });
        } else {
            setIsPreview(true);
            process.nextTick(() => {
                Prism.highlightAll();
            });
        }
    };

    return (
        <div className={style['user-resume']}>
            {/* 编辑简历 */}
            {!isPreview && (
                <>
                    <div className={style['editor-wrap']}>
                        <Editor
                            html={html}
                            setHtml={(content) => {
                                setHtml(content);
                            }}
                        />
                        <div className={style['option-wrap']}>
                            <div
                                className={`${style['resume-form-wrap']} title-form-wrap`}
                            >
                                <h6>是否公开</h6>
                                <Switch
                                    checked={isPublic}
                                    onChange={(value) => {
                                        setIsPublic(value);
                                    }}
                                />
                            </div>
                            {!isPublic && (
                                <div
                                    className={`${style['resume-form-wrap']} title-form-wrap`}
                                >
                                    <h6>密码</h6>
                                    <Input
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                        placeholder="请输入访问密码"
                                        suffix={<Icon type="icon-suo" />}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style['operate-wrap']}>
                        <Button
                            onClick={save}
                            type="primary"
                            className={style['operate-btn']}
                        >
                            保 存
                        </Button>
                        <Button
                            onClick={cancel}
                            type="primary"
                            className={style['operate-btn']}
                        >
                            取 消
                        </Button>
                    </div>
                </>
            )}

            {/* 预览简历 */}
            {isPreview && (
                <div className={style['preview-wrap']}>
                    <header className={style['header']}>
                        <h4 className="module-title">我的简历</h4>
                        <Button onClick={edit} type="primary">
                            编 辑
                        </Button>
                    </header>
                    <div
                        className={style['content']}
                        ref={htmlContentRef}
                        dangerouslySetInnerHTML={{
                            __html: html.replace(/<br\s*\/?>/g, '\n'),
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserResume;
