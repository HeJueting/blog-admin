import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import CONFIG from '../../../config';
import userAxios from '../../../api/user';

import { Button, Input, Radio } from 'antd';
import Icon from '../../../components/icon';
import Tags from '../../../components/tags';
import Upload from '../../../components/upload';

const Basic: React.FC = () => {
    // 用户id
    const [userId, setUserId] = useState('');
    // 头像
    const [headImg, setHeadImg] = useState('');
    // 用户名称
    const [userName, setUserName] = useState('');
    // 用户昵称
    const [nickName, setNickName] = useState('');
    // 性别
    const [isMale, setIsMale] = useState(true);
    const isMaleOptions = [
        {
            value: true,
            label: '男',
        },
        {
            value: false,
            label: '女',
        },
    ];
    // 星座
    const [constellation, setConstellation] = useState('');
    // 生日
    const [birthday, setBirthday] = useState('');
    // 城市
    const [city, setCity] = useState('');
    // 邮箱
    const [email, setEmail] = useState('');
    // github
    const [github, setGithub] = useState('');
    // 公司
    const [company, setCompany] = useState('');
    // 工作
    const [job, setJob] = useState('');
    // 座右铭
    const [motto, setMotto] = useState('');
    // 自我介绍
    const [introduction, setIntroduction] = useState('');
    // 爱好
    const [hobby, setHobby] = useState<string[]>([]);
    // 标签
    const [label, setLabel] = useState<string[]>([]);

    // 初始化用户信息
    const initUserInfo = async () => {
        const res = await userAxios.getUserInfo();
        const userInfo = res.data;
        // 更新用户信息
        setUserId(userInfo._id);
        setHeadImg(userInfo.headImg);
        setUserName(userInfo.userName);
        setNickName(userInfo.nickName);
        setIsMale(userInfo.isMale);
        setConstellation(userInfo.constellation);
        setBirthday(userInfo.birthday);
        setCity(userInfo.city);
        setEmail(userInfo.email);
        setGithub(userInfo.github);
        setCompany(userInfo.company);
        setJob(userInfo.job);
        setMotto(userInfo.motto);
        setIntroduction(userInfo.introduction);
        setHobby(userInfo.hobby);
        setLabel(userInfo.label);
    };

    // 保存信息
    const save = async () => {
        const res = await userAxios.updateUserInfo({
            _id: userId,
            data: {
                headImg,
                nickName,
                isMale,
                constellation,
                birthday,
                city,
                email,
                github,
                company,
                job,
                motto,
                introduction,
                hobby,
                label,
            },
        });
        if (res.code === 0) {
            window.$message.success(res.msg);
            initUserInfo();
        }
    };

    useEffect(() => {
        initUserInfo();
    }, []);

    return (
        <>
            {/* 上方信息：头像、基本信息 */}
            <div className={style['top-wrap']}>
                {/* 头像 */}
                <div className={style['header']}>
                    <div className={style['header-image']}>
                        {headImg ? (
                            <img
                                alt="头像"
                                src={
                                    headImg.indexOf('http') > -1
                                        ? headImg
                                        : `${CONFIG.IMAGE_REQUEST_PATH}/user/${headImg}?width=200`
                                }
                            />
                        ) : (
                            <Icon
                                type="icon-user1"
                                className={style['headImg-icon']}
                            />
                        )}
                    </div>
                    <Upload
                        action="/minio/admin/upload/single"
                        data={{ bucketName: 'temporary' }}
                        antdProps={{ accept: 'image/*' }}
                        uploadDone={(file) => {
                            setHeadImg(
                                `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                            );
                        }}
                    >
                        <Button
                            className={style['header-replaceBtn']}
                            type="primary"
                        >
                            更换头像
                        </Button>
                    </Upload>
                </div>
                {/* 第一列 */}
                <div className={`${style['column']}`}>
                    <div className="title-form-wrap">
                        <h6>登录名</h6>
                        <Input
                            className="form-right"
                            disabled
                            value={userName}
                            suffix={<Icon type="icon-user" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>性别</h6>
                        <Radio.Group
                            className="form-right"
                            value={isMale}
                            onChange={(e) => {
                                setIsMale(e.target.value);
                            }}
                        >
                            {isMaleOptions.map((item) => (
                                <Radio
                                    key={`radio-isMale-${item.label}`}
                                    value={item.value}
                                >
                                    {item.label}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="title-form-wrap">
                        <h6>生日</h6>
                        <Input
                            className="form-right"
                            value={birthday}
                            onChange={(e) => {
                                setBirthday(e.target.value);
                            }}
                            placeholder="请输入出生日期"
                            suffix={<Icon type="icon-cakelayered" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>邮箱</h6>
                        <Input
                            className="form-right"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            placeholder="请输入邮箱地址"
                            suffix={<Icon type="icon-youxiang" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>公司</h6>
                        <Input
                            className="form-right"
                            value={company}
                            onChange={(e) => {
                                setCompany(e.target.value);
                            }}
                            placeholder="请输入所在公司"
                            suffix={<Icon type="icon-gongsi" />}
                        />
                    </div>
                </div>
                {/* 第二列 */}
                <div className={`${style['column']} ${style['column-two']}`}>
                    <div className="title-form-wrap">
                        <h6>昵称</h6>
                        <Input
                            className="form-right"
                            value={nickName}
                            onChange={(e) => {
                                setNickName(e.target.value);
                            }}
                            placeholder="请输入昵称"
                            suffix={<Icon type="icon-real_name" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>星座</h6>
                        <Input
                            className="form-right"
                            value={constellation}
                            onChange={(e) => {
                                setConstellation(e.target.value);
                            }}
                            placeholder="请输入星座"
                            suffix={<Icon type="icon-xingqiu" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>现居城市</h6>
                        <Input
                            className="form-right"
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                            }}
                            placeholder="请输入现居城市"
                            suffix={<Icon type="icon-location" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>Github</h6>
                        <Input
                            className="form-right"
                            value={github}
                            onChange={(e) => {
                                setGithub(e.target.value);
                            }}
                            placeholder="请输入Github地址"
                            suffix={<Icon type="icon-github" />}
                        />
                    </div>
                    <div className="title-form-wrap">
                        <h6>从事工作</h6>
                        <Input
                            className="form-right"
                            value={job}
                            onChange={(e) => {
                                setJob(e.target.value);
                            }}
                            placeholder="请输入从事工作"
                            suffix={<Icon type="icon-gongzuotai" />}
                        />
                    </div>
                </div>
            </div>

            {/* 下方信息 */}
            <div className={style['bottom-wrap']}>
                <Tags
                    className={style['tags-wrap']}
                    title="爱好"
                    tags={hobby}
                    setTags={(tags) => {
                        setHobby(tags);
                    }}
                />
                <Tags
                    className={style['tags-wrap']}
                    title="标签"
                    tags={label}
                    setTags={(tags) => {
                        setLabel(tags);
                    }}
                />
                <div className={`title-form-wrap ${style['textarea-wrap']}`}>
                    <h6>座右铭</h6>
                    <Input.TextArea
                        value={motto}
                        onChange={(e) => {
                            setMotto(e.target.value);
                        }}
                        rows={2}
                    />
                </div>
                <div className={`title-form-wrap ${style['textarea-wrap']}`}>
                    <h6>个人简介</h6>
                    <Input.TextArea
                        value={introduction}
                        onChange={(e) => {
                            setIntroduction(e.target.value);
                        }}
                        rows={4}
                    />
                </div>
            </div>

            {/* 操作 */}
            <div className={style['operate-wrap']}>
                <Button onClick={save} type="primary">
                    保 存
                </Button>
            </div>
        </>
    );
};

export default Basic;
