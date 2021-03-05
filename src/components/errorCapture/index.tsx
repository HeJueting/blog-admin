import React, { useEffect } from 'react';
import errorAxios from '../../api/error';

const ErroCapture: React.FC = () => {
    // 捕获网页错误的方法
    const windowCapture = (e: ErrorEvent) => {
        errorAxios.collect({
            msg: e.error.stack,
        });
    };

    // 捕获promise错误
    const promiseCapture = (e: PromiseRejectionEvent) => {
        errorAxios.collect({
            msg: e.reason.stack || e.reason,
        });
    };

    useEffect(() => {
        window.addEventListener('error', windowCapture);
        window.addEventListener('unhandledrejection', promiseCapture);
        return () => {
            window.removeEventListener('error', windowCapture);
            window.removeEventListener('unhandledrejection', promiseCapture);
        };
    }, []);

    return null;
};

export default ErroCapture;
