import React, { useState } from 'react';
import style from './style.module.scss';
import { Input, Button } from 'antd';
import localForage from 'localforage';
import userAxios from '../../api/user';
import testAxios from '../../api/test';

const SettingTest: React.FC = () => {
    // 账号、密码
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // 经纬度
    const [locationName, setLocationName] = useState('');
    const [lng, setLng] = useState('');
    const [lat, setLat] = useState('');

    // 登录
    const login = async () => {
        const res = await userAxios.login({ userName, password });
        if (res.data.token) {
            window.$message.success('登录成功');
            await localForage.setItem('token', res.data.token);
        }
    };

    // 发送邮件
    const sendEmail = async () => {
        await testAxios.sendEmail({
            title: '测试邮件',
            to: '279975246@qq.com',
            html: 'fuck you beibei',
        });
    };

    // 创建经纬度
    const addLocation = async () => {
        const res = await testAxios.createLocation({
            time: +new Date('2012-08-08'),
            name: locationName,
            lng: lng,
            lat: lat,
        });
        if (res.code === 0) {
            window.$message.success('创建成功');
            setLocationName('');
            setLng('');
            setLat('');
        }
    };

    return (
        <div className={style['setting-test']}>
            <div className={style['wrap']}>
                <h6>用户登录</h6>
                <div className="wrap-box">
                    <Input
                        value={userName}
                        placeholder="用户名"
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                    />
                    <Input
                        value={password}
                        placeholder="密码"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button onClick={login}>登录</Button>
                </div>
            </div>

            <div className={style['wrap']}>
                <h6>邮件发送测试</h6>
                <Button onClick={sendEmail}>发送</Button>
            </div>

            <div className={style['wrap']}>
                <Input
                    value={locationName}
                    placeholder="名称"
                    onChange={(e) => {
                        setLocationName(e.target.value);
                    }}
                />
                <Input
                    value={lng}
                    placeholder="经度"
                    onChange={(e) => {
                        setLng(e.target.value);
                    }}
                />
                <Input
                    value={lat}
                    placeholder="纬度"
                    onChange={(e) => {
                        setLat(e.target.value);
                    }}
                />
                <Button onClick={addLocation}>创建location</Button>
            </div>
        </div>
    );
};

export default SettingTest;
