import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import style from './style.module.scss';
import { Input, Switch, Modal, Select, Button } from 'antd';
import CONFIG from '../../config';
import { timeFormat } from '../../utils/help';
import articleAxios from '../../api/article';
import articleCategoryAxios from '../../api/articleCategory';

import Upload from '../../components/upload';
import Editor from '../../components/editor';
import Icon from '../../components/icon';
import Tags from '../../components/tags';

const ArticleEdit: React.FC = () => {
    // location、history
    const location = useLocation();
    const history = useHistory();
    // 编辑器的state
    const [title, setTitle] = useState('');
    const [createAt, setCreateAt] = useState('');
    const [openCreateAt, setOpenCreateAt] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [purview, setPurview] = useState(0);
    const purviewOptions = [
        {
            value: 0,
            label: '公开',
        },
        {
            value: 1,
            label: '密码访问',
        },
        {
            value: 2,
            label: '私密',
        },
    ];
    const [password, setPassword] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [html, setHtml] = useState('');
    const [bacImg, setBacImg] = useState('');
    // 编辑器
    const editorRef = useRef<any>(null);

    // 初始化编辑器内容
    const initEditorContent = () => {
        const editObject: any = location.state;
        // 编辑状态
        if (editObject) {
            // 处理分类已删除，文章还存在的特殊情况
            const categoryIsHave = !!categoryList.filter(
                (item: any) => item._id === editObject.categoryId
            ).length;
            setTitle(editObject.title);
            setCreateAt(timeFormat(editObject.createAt, 0));
            setCategoryId(categoryIsHave ? editObject.categoryId : '');
            setPurview(editObject.purview);
            setPassword(editObject.password);
            setTags(editObject.tags);
            setHtml(editObject.html);
            setBacImg(editObject.bacImg);
            // 初始化编辑器的html内容
            editorRef.current.initEditorState(editObject.html);
        }
    };
    // 获取文章分类信息
    const initCategoryList = async () => {
        const res = await articleCategoryAxios.list();
        if (res.code === 0) {
            // 设置分类菜单
            setCategoryList(res.data);
        } else {
            window.$message.error(res.msg);
        }
    };
    useEffect(() => {
        initCategoryList();
    }, []);
    useEffect(() => {
        initEditorContent();
    }, [categoryList]);

    // 确认删除文章缩略图
    const checkDeleteArticleCoverImage = () => {
        Modal.confirm({
            width: '25%',
            title: '是否删除该文章的背景缩略图',
            onOk: () => {
                setBacImg('');
            },
        });
    };

    // 创建or更新文章
    const createOrSaveArticle = async (state: any) => {
        const editObject: any = location.state;
        const abstract = editorRef.current.getTextContent(200);
        const customCreatAt = +new Date(createAt);
        if (!title) {
            window.$message.error('请输入文章标题');
        } else if (!abstract) {
            window.$message.error('请输入文章内容');
        } else if (!categoryId) {
            window.$message.error('请选择文章分类');
        } else if (purview === 1 && !password) {
            window.$message.error('请输入访问密码');
        } else if (
            openCreateAt &&
            (customCreatAt < 0 || String(customCreatAt) === 'NaN')
        ) {
            window.$message.error('自定义时间格式有误');
        } else {
            let res;
            const baseData = {
                title,
                categoryId,
                html,
                abstract,
                state,
                tags,
                bacImg,
                purview,
                password,
            };
            // 创建文章
            if (!editObject) {
                res = await articleAxios.create({
                    ...baseData,
                    createAt: openCreateAt ? customCreatAt : +new Date(),
                });
            } else {
                res = await articleAxios.update({
                    _id: editObject._id,
                    ...baseData,
                    createAt: openCreateAt
                        ? customCreatAt
                        : editObject.createAt,
                    modifyAt: +new Date(),
                });
            }
            // 响应成功
            if (res.code === 0) {
                if (!editObject) {
                    window.$message.success(
                        `${state === 0 ? '已保存为草稿' : '文章发布成功'}`
                    );
                } else {
                    window.$message.success(
                        `${state === 0 ? '草稿更新成功' : '文章更新成功'}`
                    );
                }
                history.push('/article/list', null);
            }
        }
    };

    // 取消
    const cancel = () => {
        history.push('/article/list', null);
    };

    // 背景图片的展示
    const bacImageUrl = (bacImg: string) => {
        let res = bacImg;
        if (bacImg && bacImg.indexOf('temporary') === -1) {
            res = `${CONFIG.IMAGE_REQUEST_PATH}/article/${bacImg}?width=300`;
        }
        return res;
    };

    return (
        <>
            {/* 标题 */}
            <Input
                style={{ marginBottom: '1.6vw' }}
                className="title-input"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
                placeholder="请输入标题"
            />
            {/* 自定义时间 */}
            <div className={style['custom-time-wrap']}>
                <Input
                    className={style['custom-time-input']}
                    value={createAt}
                    onChange={(e) => {
                        setCreateAt(e.target.value);
                    }}
                    disabled={!openCreateAt}
                    placeholder="请自定义文章创建时间"
                    suffix={<Icon type="icon-rili" />}
                />
                <div className={style['custom-time-switch']}>
                    <Switch
                        checked={openCreateAt}
                        onChange={(value) => {
                            setOpenCreateAt(value);
                        }}
                    />
                    <span className={style['switch-tips']}>自定义创建时间</span>
                </div>
            </div>
            {/* 编辑器 */}
            <Editor
                html={html}
                setHtml={(res) => {
                    setHtml(res);
                }}
                ref={editorRef}
            />
            {/* 文章信息编辑 */}
            <div className={style['article-edit-operate']}>
                {/* 背景缩略图 */}
                <div className={style['edit-operate-left']}>
                    <Upload
                        style={{ display: !bacImg ? 'block' : 'none' }}
                        action="/minio/admin/upload/single"
                        data={{ bucketName: 'temporary' }}
                        antdProps={{ accept: 'image/*' }}
                        uploadDone={(file) => {
                            setBacImg(
                                `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                            );
                        }}
                    >
                        <div className={style['upload-wrap']}>
                            <div className={style['upload-custom']}>
                                <Icon
                                    type="icon-add2"
                                    className={style['icon-add2']}
                                />
                            </div>
                        </div>
                    </Upload>
                    <div
                        className={style['image-wrap']}
                        style={{ display: bacImg ? 'block' : 'none' }}
                    >
                        <img
                            className={style['cover-image']}
                            alt=""
                            src={bacImageUrl(bacImg)}
                        />
                        <div className={style['delete-mask']}>
                            <Icon
                                className={style['icon-delete']}
                                type="icon-delete"
                                onClick={checkDeleteArticleCoverImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={style['split']} />
                {/* 其他信息 */}
                <div className={style['edit-operate-right']}>
                    <div className="title-form-wrap">
                        <h6>文章分类</h6>
                        <Select
                            style={{ width: '12vw' }}
                            value={categoryId}
                            onChange={(value) => {
                                setCategoryId(value);
                            }}
                        >
                            {categoryList.map((item: any) => (
                                <Select.Option
                                    key={`article-category-${item._id}`}
                                    value={item._id}
                                >
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className={style['app-form-box']}>
                        <div className="title-form-wrap">
                            <h6>访问权限</h6>
                            <Select
                                style={{ width: '12vw' }}
                                value={purview}
                                onChange={(value) => {
                                    setPurview(value);
                                }}
                            >
                                {purviewOptions.map((item) => (
                                    <Select.Option
                                        key={`purview-${item.label}`}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {purview === 1 && (
                            <Input
                                style={{ width: '12vw', marginLeft: '2vw' }}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="请输入访问密码"
                            />
                        )}
                    </div>

                    <Tags
                        title="标签"
                        tags={tags}
                        setTags={(res: string[]) => {
                            setTags(res);
                        }}
                    />
                </div>
            </div>
            {/* 操作的按钮 */}
            <div className={style['operate-btn-wrap']}>
                <Button
                    style={{ marginRight: '1.6vw' }}
                    size="large"
                    type="primary"
                    onClick={async () => {
                        await createOrSaveArticle(0);
                    }}
                >
                    暂存草稿
                </Button>
                <Button
                    style={{ marginRight: '1.6vw' }}
                    size="large"
                    type="primary"
                    onClick={async () => {
                        await createOrSaveArticle(1);
                    }}
                >
                    文章发布
                </Button>
                <Button onClick={cancel} size="large">
                    取消
                </Button>
            </div>
        </>
    );
};

export default ArticleEdit;
