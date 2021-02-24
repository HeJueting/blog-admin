import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import style from './style.module.scss';
import lodash from '../../utils/lodash';
import { Tabs, Modal } from 'antd';
import albumCategoryAxios from '../../api/albumCategory';
import albumAxios from '../../api/album';
import Icon from '../../components/icon';
import OperateModal from './operateModal';
import CONFIG from '../../config';

const AlbumList: React.FC = () => {
    // history
    const history = useHistory();
    // 数据结果
    const [dataSource, setDataSource] = useState<any[]>([]);
    // 相册分类id
    const [categoryId, setCategoryId] = useState('');
    // 弹窗
    const [operation, setOperation] = useState('create');
    const [visible, setVisible] = useState(false);
    const [defaultData, setDefaultData] = useState<any>({});

    // 初始化dataSource
    const initDataSource: (categoryId?: string) => void = async (
        categoryId
    ) => {
        let categoryList = [];
        let albumList: any[] = [];
        // 请求相册分类信息
        const categoryRes = await albumCategoryAxios.searchList();
        if (categoryRes.code === 0) {
            categoryList = categoryRes.data;
        }
        // 如果不存在相册分类，提醒先去创建相册分类
        if (!categoryList.length) {
            window.$message.warn(
                '未检测到任何相册分类，请前往相册分类页面进行创建'
            );
            setTimeout(() => {
                history.push('/album/category');
            }, 1000);
        } else {
            // 请求相册信息
            const albumRes = await albumAxios.searchList();
            if (albumRes.code === 0) {
                albumList = albumRes.data;
            }
            // 根据相册分类信息和相册信息封装dataSource
            const dataSource: any[] = [];
            categoryList.forEach((category: any, index: number) => {
                const albums = albumList.filter(
                    (album) => album.categoryId === category._id
                );
                dataSource[index] = {
                    ...category,
                    children: albums,
                };
            });
            // 更新state
            setCategoryId(
                categoryId ? categoryId : lodash.get(dataSource, '[0]._id', '')
            );
            setDataSource(dataSource);
        }
    };
    useEffect(() => {
        initDataSource();
    }, []);

    // 点击编辑
    const clickEdit = (data: any) => {
        setOperation('edit');
        setVisible(true);
        setDefaultData({
            ...data,
            category: getCategoryNameByCategoryId(data.categoryId),
        });
    };

    // 点击删除
    const clickDelete = (data: any) => {
        Modal.confirm({
            title: '是否删除该相册？删除后该相册中的所有资源将被清空',
            onOk: async () => {
                const res = await albumAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    initDataSource(categoryId);
                    window.$message.success(res.msg);
                }
            },
        });
    };

    // 点击进入相册详情页面
    const enterAlbum = (info: any) => {
        history.push('/album/detail', info);
    };

    // tab切换
    const tabOnChange = (key: string) => {
        setCategoryId(key);
    };

    // 根据categoryId拿到分类信息
    const getCategoryNameByCategoryId = (id: string) => {
        const category = dataSource.filter((item) => item._id === id)[0];
        return lodash.get(category, 'name');
    };

    // 点击创建相册
    const createAlbumOnClick = () => {
        setOperation('create');
        setVisible(true);
        setDefaultData({
            category: getCategoryNameByCategoryId(categoryId),
        });
    };

    // 确认新增or编辑相册
    const handleOnCreateOrSave = async (params: any) => {
        let res;
        if (operation === 'create') {
            // 新增分类
            res = await albumAxios.create({
                categoryId,
                ...params,
            });
        } else {
            // 编辑分类
            res = await albumAxios.update({
                _id: defaultData._id,
                ...params,
            });
        }
        // 提示成功的信息
        if (res.code === 0) {
            window.$message.success(res.msg);
        }
        setVisible(false);
        initDataSource(categoryId);
    };

    return (
        <>
            <Tabs activeKey={categoryId} onChange={tabOnChange}>
                {/* 文章分类 */}
                {dataSource.map((item) => (
                    <Tabs.TabPane
                        tab={item.name}
                        key={item._id}
                        className={style['category-wrap']}
                    >
                        {item.children.map((album: any) => (
                            <div
                                className={style['album-wrap']}
                                key={album._id}
                            >
                                <div className={style['album-wrap-mask-3']} />
                                <div className={style['album-wrap-mask-2']} />
                                <div className={style['album-wrap-mask-1']}>
                                    <div className={style['mask-wrap']}>
                                        <div
                                            className={style['image-wrap']}
                                            onClick={() => {
                                                enterAlbum(album);
                                            }}
                                        >
                                            {album.bacImg && (
                                                <img
                                                    alt=""
                                                    src={`${CONFIG.IMAGE_REQUEST_PATH}/album/${album.bacImg}?width=200`}
                                                    className={
                                                        style['cover-image']
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div className={style['operate-wrap']}>
                                            <Icon
                                                className={style['icon-edit']}
                                                type="icon-edit"
                                                onClick={() => {
                                                    clickEdit(album);
                                                }}
                                            />
                                            <Icon
                                                className={style['icon-delete']}
                                                type="icon-delete"
                                                onClick={() => {
                                                    clickDelete(album);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <h6 className={style['album-name']}>
                                        {album.name}
                                    </h6>
                                </div>
                            </div>
                        ))}
                    </Tabs.TabPane>
                ))}
            </Tabs>

            {/* 新增相册集 */}
            <div
                className={style['album-add-box']}
                onClick={createAlbumOnClick}
            >
                <Icon type="icon-add1" className={style['icon-add1']} />
            </div>

            {/* 新增相册集 */}
            {visible && (
                <OperateModal
                    operation={operation}
                    handleOk={handleOnCreateOrSave}
                    visible={visible}
                    setVisible={(visible: boolean) => {
                        setVisible(visible);
                    }}
                    defaultData={defaultData}
                />
            )}
        </>
    );
};

export default AlbumList;
