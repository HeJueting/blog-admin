import React from 'react';
import style from './style.module.scss';

// 接口：props
interface IIconProps {
    type: string;
    style?: React.CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const Icon: React.FC<IIconProps> = (props) => {
    return (
        <span
            onClick={props.onClick}
            className={`iconfont ${style.iconfont} ${props.type} ${props.className}`}
            style={props.style}
        />
    );
};

export default Icon;
