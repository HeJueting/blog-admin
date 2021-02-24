import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import style from '../style.module.scss';

// 接口：data
interface IData {
    name: string;
}
// 接口：props
interface IFolderModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    handleOk: (data: IData) => void;
}

const FolderModal: React.FC<IFolderModalProps> = ({
    visible,
    setVisible,
    handleOk,
}) => {
    const [name, setName] = useState('');

    // 取消
    const onCancel = () => {
        setVisible(false);
        setName('');
    };

    // 确认
    const onOk = () => {
        if (!name) {
            window.$message.warning('文件夹名称不能为空 !');
            return;
        }
        handleOk({
            name,
        });
    };

    return (
        <Modal
            title="创建文件夹"
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width="30%"
        >
            <div className={`${style['form-wrap']} title-form-wrap`}>
                <h6>文件夹名称</h6>
                <Input
                    className={style['form-right']}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    placeholder="请输入文件夹名称"
                />
            </div>
        </Modal>
    );
};

export default FolderModal;
