import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN.js';
import userAxios from './api/user';
import activeAxios from './api/active';
import CONFIG from './config';

import style from './app.module.scss';
import 'antd/dist/antd.css';
import './assets/styles/global.scss';
import './assets/styles/coverAntd.scss';

import Provider from './store/provider';
import Routers from './components/routers';
import NavBar from './components/navBar';
import SetRem from './components/setRem';
import Header from './components/header';
import Footer from './components/footer';
import Loading from './components/loading';
import ErrorCapture from './components/errorCapture';

window.$message = message;

const App: React.FC = () => {
    // 检测用户是否已经登录
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const checkIsLogin = async () => {
        const res = await userAxios.checkLogin();
        if (res.data.isLogin) {
            setIsLogin(true);
            // 登录次数+1
            await activeAxios.addLogin();
        } else {
            window.$message.error('未登录，即将跳转到登录页面');
            setTimeout(() => {
                window.location.href = CONFIG.BLOG_LOGIN_URL;
            }, 1000);
        }
    };
    useEffect(() => {
        checkIsLogin();
    }, []);

    return (
        <ConfigProvider locale={zhCN}>
            <Provider>
                {isLogin && (
                    <BrowserRouter basename="/blog/admin">
                        <div className={style.app}>
                            <div className={style['app-wrap']}>
                                <div className={style['app-wrap-left']}>
                                    <NavBar />
                                </div>
                                <div className={style['app-wrap-right']}>
                                    <Header />
                                    <Routers />
                                    <Footer />
                                </div>
                            </div>
                        </div>
                    </BrowserRouter>
                )}
                <SetRem />
                <Loading />
                <ErrorCapture />
            </Provider>
        </ConfigProvider>
    );
};

export default App;
