import React, { useContext } from 'react';
import style from './style.module.scss';
import context from '../../store/context';

const Loading: React.FC = () => {
    const { state } = useContext(context);
    const { loading } = state;

    return (
        <div
            className={style['global-loading']}
            style={{
                opacity: loading ? 1 : 0,
                visibility: loading ? 'visible' : 'hidden',
                transition: `opacity 0.3s ease-out, visibility 0s linear ${
                    loading ? 0 : 0.3
                }s`,
            }}
        >
            <div className={style['lds-ring']}>
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    );
};

export default Loading;
