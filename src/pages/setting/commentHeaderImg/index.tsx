import React, { useState, useEffect } from 'react';
import style from '../style.module.scss';
import lodash from '../../../utils/lodash';
import CONFIG from '../../../config';
import settingAxios from '../../../api/setting';

import Icon from '../../../components/icon';
import Upload from '../../../components/upload';
import { Modal, Input, Button } from 'antd';

// 接口：props
interface ICommentHeaderImgProps {
    data: {
        _id: string;
        commentHeaderImg: {
            name: string;
            img: string;
        }[];
    };
    initSettingInfo: () => void;
}

const CommentHeaderImg: React.FC<ICommentHeaderImgProps> = ({
    data,
    initSettingInfo,
}) => {
    // 评论用户头像数据
    const [dataSource, setDataSource] = useState<any>([]);
    // 弹窗
    const [visible, setVsible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [img, setImg] = useState<string>('');

    useEffect(() => {
        if (data) {
            setDataSource(data.commentHeaderImg || []);
        }
    }, [data]);

    // 保存
    const save = async () => {
        const res = await settingAxios.update({
            _id: data._id,
            data: {
                commentHeaderImg: dataSource,
            },
        });
        if (res.code === 0) {
            initSettingInfo();
            window.$message.success('保存成功');
        }
    };

    // 确认添加
    const onOk = () => {
        if (!img) {
            window.$message.error('请上传头像配图');
        } else if (!name) {
            window.$message.error('请输入用户昵称');
        } else if (
            dataSource.filter((item: any) => item.name === name).length
        ) {
            window.$message.error('用户昵称重复');
        } else {
            dataSource.push({
                name,
                img,
            });
            setDataSource(lodash.cloneDeep(dataSource));
            onCancel();
        }
    };
    // 取消
    const onCancel = () => {
        setVsible(false);
        setName('');
        setImg('');
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>用户评论头像</h3>
                <Button onClick={save} type="primary">
                    保 存
                </Button>
            </div>
            <div className={style['comment-headerImg']}>
                {/* 添加用户头像的icon */}
                <div
                    className={style['add-wrap']}
                    onClick={() => {
                        setVsible(true);
                    }}
                >
                    <Icon type="icon-add2" className={style['icon-add2']} />
                </div>

                {/* 用户评论头像 */}
                {dataSource.map((item: any) => (
                    <div className={style['headerImg-wrap']} key={item.img}>
                        <div className={style['info']}>
                            <div className={style['img-wrap']}>
                                <img alt="用户评论头像" src={item.img} />
                                <div className={style['mask']}>
                                    <Icon
                                        onClick={() => {
                                            const newDataSource = dataSource.filter(
                                                (d: any) => d.name !== item.name
                                            );
                                            setDataSource(newDataSource);
                                        }}
                                        className={style['close']}
                                        type="icon-delete"
                                    />
                                </div>
                            </div>
                            <p title={item.name}>{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 弹窗 */}
            <Modal
                title="用户评论头像配置"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <div className={style['commentHeaderImg-modal']}>
                    {img ? (
                        <div className={style['img-wrap']}>
                            <img alt="用户评论头像" src={img}></img>
                            <div className={style['img-mask']}>
                                <Icon
                                    onClick={() => {
                                        setImg('');
                                    }}
                                    className={style['close']}
                                    type="icon-delete"
                                />
                            </div>
                        </div>
                    ) : (
                        <Upload
                            style={{
                                display: !img ? 'block' : 'none',
                            }}
                            action="/minio/admin/upload/single"
                            data={{ bucketName: 'temporary' }}
                            antdProps={{ accept: 'image/*' }}
                            uploadDone={(file) => {
                                setImg(
                                    `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                                );
                            }}
                        >
                            <div
                                className={style['commentHeaderImg-upload-box']}
                            >
                                <Icon
                                    type="icon-add2"
                                    className={style['icon-add2']}
                                />
                            </div>
                        </Upload>
                    )}

                    <div className={style['input-wrap']}>
                        <h6 className={style['title']}>用户昵称</h6>
                        <Input
                            placeholder="请输入用户昵称"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        ></Input>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CommentHeaderImg;
