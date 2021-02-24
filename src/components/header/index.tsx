import React from 'react';
import style from './style.module.scss';
import Avatar from './avatar';
import Tips from './tips';

const Header: React.FC = () => {
    return (
        <header className={style.header}>
            <Tips />
            <Avatar />
        </header>
    );
};

export default Header;
