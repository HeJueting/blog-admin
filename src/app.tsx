import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN.js';

import style from './app.module.scss';
import './assets/styles/antd.css';
import './assets/styles/global.scss';
import './assets/styles/coverAntd.scss';

import Provider from './store/provider';
import Routers from './components/routers';
import NavBar from './components/navBar';
import SetRem from './components/setRem';
import Header from './components/header';
import Footer from './components/footer';
import Loading from './components/loading';

window.$message = message;

const App: React.FC = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <Provider>
                <BrowserRouter>
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
                    <SetRem />
                    <Loading />
                </BrowserRouter>
            </Provider>
        </ConfigProvider>
    );
};

export default App;
