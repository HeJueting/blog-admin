import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import lodash from '../../../utils/lodash';

interface IOperateModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    operation: string;
    handleOk: (data: { name: string; description: string }) => void;
    defaultData: {
        name: string;
        description: string;
    };
}

const OperateModal: React.FC<IOperateModalProps> = ({
    visible,
    setVisible,
    operation,
    handleOk,
    defaultData,
}) => {
    const operationCn: { [key: string]: string } = {
        create: '新增',
        edit: '编辑',
    };
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // 初始化弹窗内容
    useEffect(() => {
        setName(lodash.get(defaultData, 'name', ''));
        setDescription(lodash.get(defaultData, 'description', ''));
    }, [defaultData]);

    const onCancel = () => {
        setVisible(false);
    };

    const onOk = () => {
        if (!name || !description) {
            window.$message.warning('分类名称、分类描述不能为空 !');
            return;
        }
        handleOk({
            name,
            description,
        });
    };

    return (
        <Modal
            title={`${operationCn[operation]}分类`}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width="60%"
        >
            <div className="title-form-wrap">
                <h6>分类名称</h6>
                <Input
                    className="app-input"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入分类名称"
                />
            </div>
            <div
                className="title-form-wrap"
                style={{ marginTop: '1.6vw', alignItems: 'start' }}
            >
                <h6>分类描述</h6>
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
