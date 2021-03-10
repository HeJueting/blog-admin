import React, { useState, useEffect, useCallback } from 'react';
import style from '../style.module.scss';
import CONFIG from '../../../config';

import Upload from '../../../components/upload';
import Icon from '../../../components/icon';
import { Modal, Button } from 'antd';
import settingAxios from '../../../api/setting';

// 接口：props
interface IHomePageImageProps {
    data: {
        _id: string;
        firstBacImage: string;
        secondBacImage: string;
        thirdBacImage: string;
        aboutMeBacImage: string;
    };
}

const HomePageImage: React.FC<IHomePageImageProps> = ({ data }) => {
    // 博客首页
    const [fisrtBacImg, setFirstBacImg] = useState('');
    const [secondBacImg, setSecondBacImg] = useState('');
    const [thirdBacImg, setThirdBacImg] = useState('');
    const [aboutMeBacImg, setAboutMeBacImg] = useState('');
    const homeBacImgs = [
        {
            title: '第一屏',
            url: fisrtBacImg,
            setUrl: setFirstBacImg,
        },
        {
            title: '第二屏',
            url: secondBacImg,
            setUrl: setSecondBacImg,
        },
        {
            title: '第三屏',
            url: thirdBacImg,
            setUrl: setThirdBacImg,
        },
        {
            title: '个人简介',
            url: aboutMeBacImg,
            setUrl: setAboutMeBacImg,
        },
    ];

    // 初始化页面数据
    const initData = useCallback(() => {
        if (data) {
            setFirstBacImg(data.firstBacImage);
            setSecondBacImg(data.secondBacImage);
            setThirdBacImg(data.thirdBacImage);
            setAboutMeBacImg(data.aboutMeBacImage);
        }
    }, [data]);
    useEffect(() => {
        initData();
    }, [initData]);

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
                firstBacImage: fisrtBacImg,
                secondBacImage: secondBacImg,
                thirdBacImage: thirdBacImg,
                aboutMeBacImage: aboutMeBacImg,
            },
        });
        if (res.code === 0) {
            window.$message.success('保存成功');
        }
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>博客首页 - 配图</h3>
                <Button onClick={save} type="primary">
                    保 存
                </Button>
            </div>
            <div className={style['home-wrap']}>
                {homeBacImgs.map((item) => (
                    <div className={style['item-wrap']} key={item.title}>
                        <h6>{item.title}</h6>
                        <Upload
                            style={{
                                display: !item.url ? 'block' : 'none',
                            }}
                            action="/minio/admin/upload/single"
                            data={{ bucketName: 'temporary' }}
                            antdProps={{ accept: 'image/*' }}
                            uploadDone={(file) => {
                                item.setUrl(
                                    `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                                );
                            }}
                        >
                            <div className={style['upload-box']}>
                                <Icon
                                    type="icon-add2"
                                    className={style['icon-add2']}
                                />
                            </div>
                        </Upload>
                        <div
                            className={style['image-wrap']}
                            style={{
                                display: item.url ? 'block' : 'none',
                            }}
                        >
                            <img
                                className={style['cover-image']}
                                alt=""
                                src={bacImageUrl(item.url)}
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
                                                item.setUrl('');
                                            },
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePageImage;
