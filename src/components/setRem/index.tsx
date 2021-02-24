import { useEffect } from 'react';

const SetRem: () => null = () => {
    // 设置网页根节点的方法
    const setRem: () => void = () => {
        const html = document.documentElement;
        const { clientWidth } = document.body;
        html.style.fontSize = `${(clientWidth / 1920) * 10}px`;
    };

    useEffect(() => {
        setRem();
        window.addEventListener('resize', setRem);
        return () => {
            window.removeEventListener('resize', setRem);
        };
    }, []);

    return null;
};

export default SetRem;
