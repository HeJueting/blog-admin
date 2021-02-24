import React, { useState, useEffect } from 'react';
import lodash from '../../../../utils/lodash';
import { Input, Modal } from 'antd';
import Icon from '../../../../components/icon';
import style from '../style.module.scss';

// 接口：props
interface ICertificateModalProps {
    type: string;
    visible: boolean;
    data: {
        name?: string;
        number?: string;
        time?: string;
    };
    setVisible: (visible: boolean) => void;
    onOk: (...params: any) => void;
}

const CertificateModal: React.FC<ICertificateModalProps> = ({
    type,
    visible,
    data,
    setVisible,
    onOk,
}) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        setName(lodash.get(data, 'name', ''));
        setNumber(lodash.get(data, 'number', ''));
        setTime(lodash.get(data, 'time', ''));
    }, []);

    // 清空表单内容
    const clearInput = () => {
        setName('');
        setNumber('');
        setTime('');
    };

    // 取消
    const cancel = () => {
        clearInput();
        setVisible(false);
    };

    // 确定
    const Ok = () => {
        if (!name) {
            window.$message.error('请输入证书名称');
        } else if (!number) {
            window.$message.error('请输入证书编号');
        } else if (!time) {
            window.$message.error('请输入获取时间');
        } else {
            onOk({
                key: 'certificateDataSource',
                type: type,
                defaultData: data,
                name,
                number,
                time,
            });
            cancel();
        }
    };

    return (
        <Modal
            title={`${type === 'create' ? '新增' : '编辑'}技能证书`}
            visible={visible}
            onOk={Ok}
            onCancel={cancel}
            width="60vw"
            okText="确认"
            cancelText="取消"
            className="user-info-other-modal"
        >
            <div className="title-form-wrap">
                <h6>名称</h6>
                <Input
                    className="form-right"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入证书名称"
                    suffix={<Icon type="icon-5" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>编号</h6>
                <Input
                    className="form-right"
                    value={number}
                    onChange={(e) => {
                        setNumber(e.target.value);
                    }}
                    placeholder="请输入证书编号"
                    suffix={<Icon type="icon-bianhao" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>时间</h6>
                <Input
                    className="form-right"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                    }}
                    placeholder="请输入获得时间"
                    suffix={<Icon type="icon-rili" />}
                />
            </div>
        </Modal>
    );
};

export default CertificateModal;
