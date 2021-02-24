import React, { useEffect, useState } from 'react';
import style from '../style.module.scss';
import lodash from '../../../utils/lodash';
import CONFIG from '../../../config';
import settingAxios from '../../../api/setting';

import { Button, Modal } from 'antd';
import Upload from '../../../components/upload';
import Icon from '../../../components/icon';

// 接口：props
interface ICarsouelImageProps {
    data: {
        _id: string;
        carsouelImages: string[];
    };
}

const CarsouelImage: React.FC<ICarsouelImageProps> = ({ data }) => {
    const [images, setImages] = useState<string[]>([]);

    // 初始化页面数据
    const initData = () => {
        if (data) {
            setImages(data.carsouelImages);
        }
    };
    useEffect(() => {
        initData();
    }, [data]);

    // 背景图片的展示
    const bacImageUrl = (bacImg: string) => {
        let res = bacImg;
        if (bacImg && bacImg.indexOf('temporary') === -1) {
            res = `${CONFIG.IMAGE_REQUEST_PATH}/setting/${bacImg}?width=300`;
        }
        return res;
    };

    // 点击保存（博客首页）
    const save = async () => {
        const res = await settingAxios.update({
            _id: data._id,
            data: {
                carsouelImages: images,
            },
        });
        if (res.code === 0) {
            window.$message.success('保存成功');
        }
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>博客轮播图</h3>
                <Button onClick={save} type="primary">
                    保存
                </Button>
            </div>

            <div className={style['carsouel-wrap']}>
                {images.map((url: string, index: number) => (
                    <div className={style['image-box']} key={url}>
                        <img
                            className={style['cover-image']}
                            alt=""
                            src={bacImageUrl(url)}
                        />
                        <div className={style['delete-mask']}>
                            <Icon
                                className={style['icon-delete']}
                                type="icon-delete"
                                onClick={() => {
                                    Modal.confirm({
                                        width: '25%',
                                        title: '是否删除该配图？',
                                        onOk: () => {
                                            images.splice(index, 1);
                                            setImages(lodash.cloneDeep(images));
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                ))}

                <Upload
                    action="/minio/admin/upload/single"
                    data={{ bucketName: 'temporary' }}
                    antdProps={{ accept: 'image/*' }}
                    uploadDone={(file) => {
                        images.push(
                            `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                        );
                        setImages(lodash.cloneDeep(images));
                    }}
                >
                    <div className={style['upload-box']}>
                        <Icon type="icon-add2" className={style['icon-add2']} />
                    </div>
                </Upload>
            </div>
        </div>
    );
};

export default CarsouelImage;
