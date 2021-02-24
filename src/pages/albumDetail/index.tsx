import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Modal } from 'antd';
import Icon from '../../components/icon';
import Upload from '../../components/upload';
import ImageZoom from '../../components/imageZoom';
import CONFIG from '../../config';
import photoAxios from '../../api/photo';

const AlbumDetail: React.FC = () => {
    // location、history
    const location = useLocation();
    const history = useHistory();
    // state
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [imageZoomVisible, setImageZoomVisible] = useState(false);
    const [imageZoomUrl, setImageZoomUrl] = useState('');
    const [albumInfo, setAlbumInfo] = useState<any>({});

    // 初始化页面数据
    useEffect(() => {
        // 如果没有具体相册信息，直接放回到相册管理页面
        const query: any = location.state;
        if (!query) {
            history.push('/album/list', null);
        } else {
            setAlbumInfo(query);
        }
    }, []);
    useEffect(() => {
        initDataSource();
    }, [albumInfo]);

    // 初始化页面数据
    const initDataSource = async () => {
        console.log('albumInfo', albumInfo);
        const res = await photoAxios.searchList({
            albumId: albumInfo._id,
        });
        if (res.code === 0) {
            setDataSource(res.data);
        }
    };

    // 点击上传照片
    const clickUploadPhotoBtn = () => {
        setUploadVisible(true);
    };

    // 取消上传
    const onCancel = () => {
        setUploadVisible(false);
    };

    // 点击返回
    const clickReturnBack = () => {
        history.push('/album/list', null);
    };

    // 点击删除照片
    const clickDeletePhoto = (data: any) => {
        Modal.confirm({
            title: '是否删除该照片',
            onOk: async () => {
                const res = await photoAxios.delete(data);
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success('照片删除成功');
                }
            },
        });
    };

    // 点击查看照片
    const clickCheckPhoto = (data: any) => {
        setImageZoomVisible(true);
        setImageZoomUrl(`${CONFIG.IMAGE_REQUEST_PATH}/album/${data.url}`);
    };

    // 自定义上传内容展示
    const customRender = (originNode: any, file: any) => {
        const { status } = file;
        let resDom: any = '';
        switch (status) {
            case 'uploading':
                resDom = (
                    <div className="image-item">
                        <div className="loading-box">
                            <Icon type="icon-loading" />
                        </div>
                    </div>
                );
                break;
            case 'done':
                resDom = (
                    <div className="image-item">
                        <div className="image-box">
                            <img
                                alt=""
                                src={`${CONFIG.IMAGE_REQUEST_PATH}/album/${file.response.url}?width=100`}
                            />
                        </div>
                    </div>
                );
                break;
        }
        return resDom;
    };

    return (
        <>
            {/* 顶部 */}
            <header className={style['photo-header']}>
                <div className={style['header-left']} onClick={clickReturnBack}>
                    <Icon type="icon-fanhui" className={style['iconfont']} />
                    <span>返回相册目录</span>
                </div>
                <Button
                    type="primary"
                    size="large"
                    onClick={clickUploadPhotoBtn}
                >
                    上传照片
                </Button>
            </header>
            {/* 中间照片部分 */}
            <div className={style['photo-wrap']}>
                {dataSource.map((item) => (
                    <div
                        className={style['image-box']}
                        key={`photo-${item._id}`}
                    >
                        <div className={style['image-wrap']}>
                            <img
                                alt=""
                                src={`${CONFIG.IMAGE_REQUEST_PATH}/album/${item.url}?width=200`}
                            />
                        </div>
                        <div className={style['delete-wrap']}>
                            <Icon
                                className={style['iconfont']}
                                type="icon-eye"
                                onClick={() => {
                                    clickCheckPhoto(item);
                                }}
                            />
                            <Icon
                                className={style['iconfont']}
                                type="icon-delete"
                                onClick={() => {
                                    clickDeletePhoto(item);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* 上传照片的弹窗 */}
            <Modal
                title="上传照片"
                visible={uploadVisible}
                onCancel={onCancel}
                className="album-photo-upload-modal"
                width="80%"
                footer={null}
            >
                <Upload
                    action="/album/admin/upload/multi"
                    multiple
                    uploadDone={initDataSource}
                    customRender={customRender}
                    beforeUpload={(file) => {
                        const isImage =
                            file.type === 'image/jpeg' ||
                            file.type === 'image/png' ||
                            file.type === 'image/jpg';
                        if (!isImage) {
                            window.$message.warn(
                                `${file.name}文件上传失败，请选择图片资源上传`
                            );
                        }
                        return isImage;
                    }}
                    data={{
                        albumId: albumInfo._id,
                    }}
                    footer={null}
                >
                    <div className="upload-box">
                        <Icon type="icon-add2" />
                    </div>
                </Upload>
            </Modal>

            {/* 照片缩放器 */}
            <ImageZoom
                visible={imageZoomVisible}
                url={imageZoomUrl}
                setVisible={(visible) => {
                    setImageZoomVisible(visible);
                }}
            />
        </>
    );
};

export default AlbumDetail;
