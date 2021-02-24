import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useLocation, useHistory } from 'react-router-dom';
import { Input, Button } from 'antd';
import Editor from '../../components/editor';
import Icon from '../../components/icon';
import recordAxios from '../../api/record';
import { timeFormat } from '../../utils/help';

const RecordEdit: React.FC = () => {
    // location、history
    const location = useLocation();
    const history = useHistory();
    // state
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [customCreateAt, setCustomCreateAt] = useState('');
    const [html, setHtml] = useState('');
    // 编辑器
    const editorRef = useRef<any>(null);

    // 初始化内容
    const initDefaultState = () => {
        const editObject: any = location.state;
        if (editObject) {
            setIsEdit(true);
            setTitle(editObject.title);
            setHtml(editObject.content);
            setCustomCreateAt(timeFormat(editObject.time, 0));
            // 初始化编辑器的html内容
            editorRef.current.initEditorState(editObject.content);
        }
    };
    useEffect(() => {
        initDefaultState();
    }, []);

    // 文章标题发生改变
    const articleTitleOnChange = (e: any) => {
        setTitle(e.target.value);
    };

    // 自定义时间发生改变
    const customCreateAtOnChange = (e: any) => {
        setCustomCreateAt(e.target.value);
    };

    // 点击提交
    const submit = async () => {
        const editObject: any = location.state;
        const time = +new Date(customCreateAt);
        const abstract = editorRef.current.getTextContent(200);
        if (!title) {
            window.$message.warn('请输入标题');
        } else if (time < 0 || String(time) === 'NaN') {
            window.$message.error('自定义时间格式有误');
        } else if (!abstract) {
            window.$message.warn('请输入内容');
        } else {
            let res;
            const baseData = {
                title,
                time,
                content: html,
                abstract,
            };
            // 发布 or 更新
            if (!isEdit) {
                res = await recordAxios.create(baseData);
            } else {
                res = await recordAxios.update({
                    _id: editObject._id,
                    ...baseData,
                });
            }
            if (res.code === 0) {
                window.$message.success(isEdit ? '保存成功' : '发布成功');
                history.push('/record/list', null);
            }
        }
    };

    return (
        <>
            {/* 标题 */}
            <Input
                style={{ marginBottom: '1.6vw' }}
                className="title-input"
                value={title}
                onChange={articleTitleOnChange}
                placeholder="请输入事件标题"
            />
            {/* 自定义时间 */}
            <Input
                style={{ marginBottom: '1.6vw' }}
                value={customCreateAt}
                onChange={customCreateAtOnChange}
                placeholder="请自定义该事件创建时间"
                suffix={<Icon type="icon-rili" />}
            />
            {/* 编辑器 */}
            <Editor
                html={html}
                setHtml={(content) => {
                    setHtml(content);
                }}
                ref={editorRef}
            />
            {/* 操作的按钮 */}
            <div className={style['operate-btn-wrap']}>
                <Button size="large" type="primary" onClick={submit}>
                    {isEdit ? '更新' : '提交'}
                </Button>
                <Button className={style['btn']} size="large">
                    取消
                </Button>
            </div>
        </>
    );
};

export default RecordEdit;
