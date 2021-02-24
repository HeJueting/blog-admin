import React, { useState, useEffect } from 'react';
import './style.scss';
import { showLoading, hiddenLoading } from '../../utils/help';
import CONFIG from '../../config';
import localForage from 'localforage';
import { Upload as AntdUpload } from 'antd';

// 接口：file对象
interface IFileObj {
    type: string;
    name: string;
    status: string;
}
// 接口：props
interface IUploadProps {
    action: string;
    style?: any;
    multiple?: boolean;
    data?: any;
    antdProps?: any;
    uploadDone?: (file: IFileObj) => void;
    beforeUpload?: (file: IFileObj) => void;
    customRender?: (originNode: any, file: IFileObj) => any;
    footer?: any;
}

const Upload: React.FC<IUploadProps> = ({
    action,
    style = {},
    multiple = false,
    children,
    data = {},
    antdProps = {},
    uploadDone = () => {},
    beforeUpload,
    customRender = () => '',
    footer,
}) => {
    // 初始化authorization
    const [authorization, setAuthorization] = useState('');
    const initAuthorization = async () => {
        const token = (await localForage.getItem('token')) || '';
        setAuthorization(`Bearer ${token}`);
    };
    useEffect(() => {
        initAuthorization();
        if (footer) {
            antdProps.footer = footer;
        }
    }, []);

    // 上传之前的生命钩子
    const defaultBeforeUpload = () => {
        showLoading();
        return true;
    };

    // 上传状态发生改变
    const uploadStatusOnChange = (params: any) => {
        const { file } = params;
        switch (file.status) {
            case 'error':
                window.$message.error(file.response.msg || file.error.message);
                hiddenLoading();
                break;
            case 'done':
                if (file.response.code === 0) {
                    window.$message.success(file.response.msg);
                    uploadDone(file);
                } else {
                    window.$message.error(file.response.msg);
                }
                hiddenLoading();
                break;
        }
    };

    return (
        <div className="form-upload" style={style}>
            <AntdUpload
                className={`form-upload-${multiple ? 'multiple' : 'single'}`}
                action={`${CONFIG.REQUEST_BASE_URL}${action}`}
                multiple={multiple}
                data={data}
                headers={{
                    Authorization: authorization,
                }}
                onChange={uploadStatusOnChange}
                beforeUpload={beforeUpload || defaultBeforeUpload}
                itemRender={customRender}
                {...antdProps}
            >
                {children}
            </AntdUpload>
        </div>
    );
};

export default Upload;
