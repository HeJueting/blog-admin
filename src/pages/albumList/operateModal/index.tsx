import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { Modal, Input, Select } from 'antd';
import lodash from '../../../utils/lodash';
import Upload from '../../../components/upload';
import CONFIG from '../../../config';
import Icon from '../../../components/icon';
import locationAxios from '../../../api/location';

// 接口：props
interface IOperateModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    operation: string;
    handleOk: (data: any) => void;
    defaultData: any;
}

const OperateModal: React.FC<IOperateModalProps> = ({
    visible,
    setVisible,
    operation,
    handleOk,
    defaultData,
}) => {
    // 操作提示
    const operationCn: { [key: string]: string } = {
        create: '新增',
        edit: '编辑',
    };
    // 相册名称
    const [name, setName] = useState('');
    // 相册所属分类（不可修改）
    const [category, setCategory] = useState('');
    // 相册权限
    const [purview, setPurview] = useState(0);
    const purviewOptions = [
        {
            value: 0,
            label: '公开',
        },
        {
            value: 1,
            label: '密码访问',
        },
        {
            value: 2,
            label: '私密',
        },
    ];
    // 相册密码
    const [password, setPassword] = useState('');
    // 相册描述
    const [description, setDescription] = useState('');
    // 相册封面图
    const [bacImg, setBacImg] = useState('');
    // 拍摄地点
    const [location, setLocation] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);

    // 初始化页面数据
    useEffect(() => {
        // 获取地理信息列表
        getLocationList();
        // 初始化数据
        setName(lodash.get(defaultData, 'name', ''));
        setCategory(lodash.get(defaultData, 'category', ''));
        setPurview(lodash.get(defaultData, 'purview', 0));
        setPassword(lodash.get(defaultData, 'password', ''));
        setBacImg(lodash.get(defaultData, 'bacImg', ''));
        setLocation(lodash.get(defaultData, 'location', ''));
        setDescription(lodash.get(defaultData, 'description', ''));
    }, []);

    // 确认是否删除相册背景缩略图
    const checkDeleteAlbumBacImage = () => {
        Modal.confirm({
            width: '25%',
            title: '是否删除该相册的背景缩略图',
            onOk: () => {
                setBacImg('');
            },
        });
    };

    // 获取地理信息列表
    const getLocationList = async () => {
        const res = await locationAxios.search();
        if (res.code === 0) {
            setLocationOptions(res.data);
        }
    };

    const onCancel = () => {
        setVisible(false);
    };

    const onOk = () => {
        if (!name) {
            window.$message.warning('相册名称不能为空');
        } else if (purview === 1 && !password) {
            window.$message.warning('访问密码不能为空');
        } else if (!description) {
            window.$message.warning('相册描述不能为空');
        } else if (!location) {
            window.$message.warning('请选择拍摄地点');
        } else {
            handleOk({
                name,
                purview,
                password,
                description,
                bacImg,
                location,
            });
        }
    };

    // 背景图片的展示
    const bacImageUrl = (bacImg: string) => {
        let res = bacImg;
        if (bacImg && bacImg.indexOf('temporary') === -1) {
            res = `${CONFIG.IMAGE_REQUEST_PATH}/album/${bacImg}?width=200`;
        }
        return res;
    };

    return (
        <Modal
            title={`${operationCn[operation]}相册`}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width="40%"
        >
            <div className="title-form-wrap">
                <h6>相册名称</h6>
                <Input
                    className="app-input"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入相册名称"
                />
            </div>
            <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                <h6>相册分类</h6>
                <Input disabled className="app-input" value={category} />
            </div>

            <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                <h6>访问权限</h6>
                <Select
                    style={{ width: '100%' }}
                    value={purview}
                    onChange={(value) => {
                        setPurview(value);
                    }}
                >
                    {purviewOptions.map((item) => (
                        <Select.Option
                            key={`purview-${item.label}`}
                            value={item.value}
                        >
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {purview === 1 && (
                <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                    <h6>访问密码</h6>
                    <Input
                        className="app-input"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="请输入访问密码"
                    />
                </div>
            )}

            <div className={style['bacImg-form-wrap']}>
                <h6>封面图</h6>
                <div className={style['bacImg-box']}>
                    {!bacImg && (
                        <Upload
                            action="/minio/admin/upload/single"
                            data={{ bucketName: 'temporary' }}
                            antdProps={{ accept: 'image/*' }}
                            uploadDone={(file: any) => {
                                setBacImg(
                                    `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${file.name}`
                                );
                            }}
                        >
                            <div className={style['upload-wrap']}>
                                <div className={style['upload-custom']}>
                                    <Icon
                                        type="icon-add2"
                                        className={style['icon-add2']}
                                    />
                                </div>
                            </div>
                        </Upload>
                    )}
                    {bacImg && (
                        <div className={style['image-wrap']}>
                            <img
                                className={style['cover-image']}
                                alt=""
                                src={bacImageUrl(bacImg)}
                            />
                            <div className={style['delete-mask']}>
                                <Icon
                                    className={style['icon-delete']}
                                    type="icon-delete"
                                    onClick={checkDeleteAlbumBacImage}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                <h6>拍摄地点</h6>
                <Select
                    style={{ width: '100%' }}
                    value={location}
                    onChange={(value) => {
                        setLocation(value);
                    }}
                >
                    {locationOptions.map((item: any) => (
                        <Select.Option
                            key={`purview-${item._id}`}
                            value={item._id}
                        >
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <div
                className="title-form-wrap"
                style={{ marginTop: '1.6vw', alignItems: 'start' }}
            >
                <h6>相册描述</h6>
                <Input.TextArea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    rows={4}
                    placeholder="请输入分类描述"
                />
            </div>
        </Modal>
    );
};

export default OperateModal;
