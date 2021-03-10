import React, { useState, useEffect } from 'react';
import lodash from '../../../utils/lodash';
import { Modal, Input, Switch } from 'antd';

// 接口：props
interface IOperateModalProp {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    operation: string;
    handleOk: (data: {
        name: string;
        isPublic: boolean;
        description: string;
        parentId: string;
    }) => void;
    defaultData: {
        name?: string;
        isPublic?: boolean;
        description?: string;
        parentId?: string;
    };
}

const OperateModal: React.FC<IOperateModalProp> = ({
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
    const [isPublic, setIsPublic] = useState(false);
    const [description, setDescription] = useState('');

    // 初始化数据
    useEffect(() => {
        const defaultName = lodash.get(defaultData, 'name', '');
        const defaultIsPublic = lodash.get(defaultData, 'isPublic', true);
        const defaultDescription = lodash.get(defaultData, 'description', '');
        setName(defaultName);
        setIsPublic(defaultIsPublic);
        setDescription(defaultDescription);
    }, [defaultData]);

    // 取消
    const onCancel = () => {
        setVisible(false);
    };

    // 确认
    const onOk = () => {
        const defaultParentId = lodash.get(defaultData, 'parentId', '');
        if (!name || !description) {
            window.$message.warning('分类名称、分类描述不能为空 !');
            return;
        }
        handleOk({
            name,
            isPublic,
            description,
            parentId: defaultParentId,
        });
    };

    return (
        <Modal
            title={`${operationCn[operation]}分类`}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            className="article-category-modal"
            width="60%"
        >
            <div className="title-form-wrap">
                <h6>分类名称</h6>
                <Input
                    className="form-right"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入分类名称"
                />
            </div>
            <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                <h6>是否公开</h6>
                <Switch
                    checked={isPublic}
                    onChange={(value) => {
                        setIsPublic(value);
                    }}
                />
            </div>
            <div className="title-form-wrap" style={{ marginTop: '1.6vw' }}>
                <h6>分类描述</h6>
                <Input.TextArea
                    className="form-right"
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
