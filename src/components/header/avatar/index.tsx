import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import localForage from 'localforage';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown, Modal, Button, Input } from 'antd';
import Icon from '../../icon';
import userAxios from '../../../api/user';
import CONFIG from '../../../config';

const Avatar: React.FC = () => {
    // location、history
    const history = useHistory();
    // 头像
    const [headImg, setHeadImg] = useState('');
    // 新消息
    const [news, setNews] = useState(0);
    // 修改密码弹窗
    const [visible, setVisible] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    // 验证码过期时间
    const [exTimeNum, setExTimeNum] = useState(0);

    // 初始化页面数据
    const initState = async () => {
        const res = await userAxios.getUserInfo();
        if (res.code === 0) {
            const { headImg, news } = res.data;
            setNews(news);
            setHeadImg(
                headImg
                    ? `${CONFIG.IMAGE_REQUEST_PATH}/user/${headImg}?width=100`
                    : ''
            );
        }
    };
    useEffect(() => {
        initState();
    }, []);

    // 点击发送验证码
    const sendVerifyCode = async () => {
        const res = await userAxios.sendVerifyCode();
        if (res.code === 0) {
            window.$message.success('验证码已发送');
            setExTimeNum(60);
        }
    };
    useEffect(() => {
        if (exTimeNum > 1) {
            setTimeout(() => {
                setExTimeNum(exTimeNum - 1);
            }, 1000);
        }
    }, [exTimeNum]);

    // 确认修改密码
    const onOk = async () => {
        if (!verifyCode) {
            window.$message.warn('验证码不能为空');
        } else if (!newPassword || !newPasswordConfirm) {
            window.$message.warn('密码不能为空');
        } else if (newPassword !== newPasswordConfirm) {
            window.$message.warn('两次密码不一致');
        } else {
            const res = await userAxios.updatePass({
                code: verifyCode,
                pass: newPassword,
            });
            if (res.code === 0) {
                window.$message.success('修改密码成功，请重新登录');
                await localForage.setItem('token', '');
                setVisible(false);
                // 跳转到登录界面
                setTimeout(() => {
                    window.location.href = CONFIG.BLOG_LOGIN_URL;
                }, 500);
            }
        }
    };
    // 取消
    const onCancel = () => {
        setVisible(false);
        setVerifyCode('');
        setNewPassword('');
        setNewPasswordConfirm('');
        setExTimeNum(0);
    };

    // 菜单列表
    const menuList = [
        {
            name: `新消息${`（${news}）`}`,
            icon: 'icon-xiaoxi',
            style: news > 0 ? { color: 'red' } : {},
            click: async () => {
                await userAxios.resetNews();
                setNews(0);
                history.push('/comment/list');
            },
        },
        {
            name: '修改密码',
            icon: 'icon-suo',
            click: () => {
                setVisible(true);
            },
        },
        {
            name: '退出登录',
            icon: 'icon-tuichu_huaban1',
            click: () => {
                Modal.confirm({
                    title: '是否退出登录？',
                    onOk: async () => {
                        await localForage.setItem('token', '');
                        window.$message.success('退出登录成功');
                        // 跳转到登录界面
                        setTimeout(() => {
                            window.location.href = CONFIG.BLOG_LOGIN_URL;
                        }, 500);
                    },
                });
            },
        },
    ];

    return (
        <>
            <Dropdown
                overlay={() => (
                    <Menu>
                        {menuList.map((item) => (
                            <Menu.Item
                                style={item.style || {}}
                                className={style['avatar-menu-item']}
                                key={`avatar-menu-${item.icon}`}
                                onClick={item.click}
                            >
                                <Icon
                                    type={item.icon}
                                    className={style['iconfont']}
                                />
                                <span>{item.name}</span>
                            </Menu.Item>
                        ))}
                    </Menu>
                )}
                placement="bottomRight"
                arrow
            >
                <div className={style['header-avatar']}>
                    {headImg ? (
                        <img src={headImg} alt="" />
                    ) : (
                        <Icon
                            type="icon-user1"
                            className={style['icon-user1']}
                        />
                    )}
                </div>
            </Dropdown>

            {/*  修改密码的弹窗  */}
            <Modal
                title="修改密码"
                visible={visible}
                onCancel={onCancel}
                onOk={onOk}
                maskClosable={false}
            >
                <div className={style['row-wrap']}>
                    <Input
                        placeholder="请输入验证码"
                        value={verifyCode}
                        onChange={(e) => {
                            setVerifyCode(e.target.value);
                        }}
                    />
                    <Button disabled={exTimeNum > 0} onClick={sendVerifyCode}>
                        {exTimeNum > 0 ? exTimeNum : '点击获取验证码'}
                    </Button>
                </div>

                <Input
                    style={{ marginTop: '1vw' }}
                    placeholder="请输入密码"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                    }}
                />

                <Input
                    style={{ marginTop: '1vw' }}
                    placeholder="请再次输入密码"
                    value={newPasswordConfirm}
                    onChange={(e) => {
                        setNewPasswordConfirm(e.target.value);
                    }}
                />
            </Modal>
        </>
    );
};

export default Avatar;
