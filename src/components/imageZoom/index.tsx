import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import Icon from '../icon';

// 接口：props
interface IImageZoomProps {
    url: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const ImageZoom: React.FC<IImageZoomProps> = ({ url, visible, setVisible }) => {
    // 缩放等级
    const [level, setLevel] = useState(3);
    // 宽度大于长度
    const [isWidthEr, setIsWidthEr] = useState(true);

    // 初始化isWidthEr
    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setIsWidthEr(!!(img.width > img.height));
        };
    }, []);

    const zoomMax = () => {
        if (level < 8) {
            setLevel(level + 1);
        }
    };

    const zoomMin = () => {
        if (level > 1) {
            setLevel(level - 1);
        }
    };

    const close = () => {
        setLevel(3);
        setIsWidthEr(true);
        setVisible(false);
    };

    // 图片的style
    const getImgStyle = () => {
        const style: any = {};
        if (isWidthEr) {
            style.width = `${level * 10}vw`;
        } else {
            style.height = `${level * 10}vw`;
        }
        return style;
    };

    const imgStyle = getImgStyle();

    return (
        <div
            className={style['image-zoom']}
            style={{
                opacity: visible ? 1 : 0,
                visibility: visible ? 'visible' : 'hidden',
                transition: `opacity 0.2s ease-in-out 0s, visibility 0s ease-in-out ${
                    visible ? 0 : 0.2
                }s`,
            }}
        >
            <div className={style['image-wrap']}>
                <div className={style['image-inner-wrap']}>
                    <img alt="" style={imgStyle} src={url} />
                </div>
            </div>
            <div className={style['operate-wrap']}>
                <Icon
                    type="icon-suoxiao"
                    className={style['iconfont']}
                    onClick={zoomMin}
                />
                <Icon
                    type="icon-fangda"
                    className={style['iconfont']}
                    onClick={zoomMax}
                />
            </div>
            <div className={style['close-wrap']}>
                <Icon
                    type="icon-cc-close-crude"
                    className={style['iconfont']}
                    onClick={close}
                />
            </div>
        </div>
    );
};

export default ImageZoom;
