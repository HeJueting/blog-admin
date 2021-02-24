import React, { useState, useEffect } from 'react';
import lodash from '../../../utils/lodash';
import { Modal, Input, Select } from 'antd';
import style from '../style.module.scss';

// 接口：data
interface IData {
    name: string;
    purview: number;
    password: string;
}
// 接口: props
interface IBucketModalProps {
    operation: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    defaultData: IData | {};
    handleOk: (data: IData) => void;
}

const BucketModal: React.FC<IBucketModalProps> = ({
    visible,
    operation,
    handleOk,
    setVisible,
    defaultData,
}) => {
    const operationCn: { [key: string]: string } = {
        create: '新增',
        edit: '编辑',
    };
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
    const [name, setName] = useState('');
    const [purview, setPurview] = useState(0);
    const [password, setPassword] = useState('');

    // 初始化state
    useEffect(() => {
        setName(lodash.get(defaultData, 'name', ''));
        setPurview(lodash.get(defaultData, 'purview', 0));
        setPassword(lodash.get(defaultData, 'password', ''));
    }, []);

    // 点击取消
    const onCancel = () => {
        setVisible(false);
        setPurview(0);
        setPassword('');
        setName('');
    };

    // 点击确定
    const onOk = () => {
        if (!name) {
            window.$message.warning('存储桶名称不能为空 !');
            return;
        }
        if (purview === 1 && !password) {
            window.$message.warning('访问密码不能为空 !');
            return;
        }
        handleOk({
            name,
            purview,
            password,
        });
    };

    return (
        <Modal
            title={`${operationCn[operation]}存储桶`}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width="30%"
        >
            <div className={`${style['form-wrap']} title-form-wrap`}>
                <h6>存储桶名称</h6>
                <Input
                    className={style['wrap-right']}
                    disabled={operation === 'edit'}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入存储桶名称"
                />
            </div>
            <div className={`${style['form-wrap']} title-form-wrap`}>
                <h6>访问权限</h6>
                <Select
                    className={style['wrap-right']}
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
                <div className={`${style['form-wrap']} title-form-wrap`}>
                    <h6>访问密码</h6>
                    <Input
                        className={style['wrap-right']}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="请输入访问密码"
                    />
                </div>
            )}
        </Modal>
    );
};

export default BucketModal;
