import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import CONFIG from '../../config';

const Footer: React.FC = () => {
    const [time, setTime] = useState<string>('');

    const setRuningTime = (): void => {
        const current = +new Date();
        const diff = (current - CONFIG.PUBLISH_TIME) / 1000;
        const dd = parseInt(String(diff / 60 / 60 / 24));
        const hh = parseInt(String((diff / 60 / 60) % 24));
        const mm = parseInt(String((diff / 60) % 60));
        const ss = parseInt(String(diff % 60));
        setTime(
            `${dd}天 ${hh < 10 ? `0${hh}` : hh}时 ${
                mm < 10 ? `0${mm}` : mm
            }分 ${ss < 10 ? `0${ss}` : ss}秒`
        );
    };

    useEffect(() => {
        setRuningTime();
        const timer = setInterval(() => {
            setRuningTime();
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <footer className={style.footer}>
            Design By He Jueting
            <span>|</span>
            渝ICP备18002750号
            <span>|</span>
            本站已运行: {time}
        </footer>
    );
};

export default Footer;
