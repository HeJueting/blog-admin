import React, { useState, useEffect } from 'react';
import lodash from '../../../../utils/lodash';
import { Input, Modal } from 'antd';
import Icon from '../../../../components/icon';
import style from '../style.module.scss';

// 接口：props
interface IWorkModalProps {
    type: string;
    visible: boolean;
    data: {
        company?: string;
        job?: string;
        location?: string;
        startTime?: string;
        endTime?: string;
    };
    setVisible: (visible: boolean) => void;
    onOk: (...params: any) => void;
}

const WorkModal: React.FC<IWorkModalProps> = ({
    type,
    visible,
    data,
    setVisible,
    onOk,
}) => {
    const [company, setCompany] = useState('');
    const [job, setJob] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        setCompany(lodash.get(data, 'company', ''));
        setJob(lodash.get(data, 'job', ''));
        setLocation(lodash.get(data, 'location', ''));
        setStartTime(lodash.get(data, 'startTime', ''));
        setEndTime(lodash.get(data, 'endTime', ''));
    }, []);

    // 清空表单内容
    const clearInput = () => {
        setCompany('');
        setJob('');
        setLocation('');
        setStartTime('');
        setEndTime('');
    };

    // 取消
    const cancel = () => {
        clearInput();
        setVisible(false);
    };

    // 确定
    const Ok = () => {
        if (!company) {
            window.$message.error('请输入公司名称');
        } else if (!job) {
            window.$message.error('请输入工作岗位');
        } else if (!location) {
            window.$message.error('请输入工作地点');
        } else if (!startTime) {
            window.$message.error('请输入开始时间');
        } else {
            onOk({
                key: 'workDataSource',
                type: type,
                defaultData: data,
                company,
                job,
                location,
                startTime,
                endTime,
            });
            cancel();
        }
    };

    return (
        <Modal
            title={`${type === 'create' ? '新增' : '编辑'}工作经历`}
            visible={visible}
            onOk={Ok}
            onCancel={cancel}
            width="60vw"
            okText="确认"
            cancelText="取消"
            className="user-info-other-modal"
        >
            <div className="title-form-wrap">
                <h6>公司</h6>
                <Input
                    className="form-right"
                    value={company}
                    onChange={(e) => {
                        setCompany(e.target.value);
                    }}
                    placeholder="请输入公司名称"
                    suffix={<Icon type="icon-gongsi" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>岗位</h6>
                <Input
                    className="form-right"
                    value={job}
                    onChange={(e) => {
                        setJob(e.target.value);
                    }}
                    placeholder="请输入工作岗位"
                    suffix={<Icon type="icon-icon" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>地点</h6>
                <Input
                    className="form-right"
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                    }}
                    placeholder="请输入工作地点"
                    suffix={<Icon type="icon-location" />}
                />
            </div>
            <div
                className={`${style['title-form-wrap']} title-form-wrap app-form-interval-wrap`}
            >
                <h6>起止时间</h6>
                <div className="start-end-time form-right">
                    <Input
                        value={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                        }}
                        placeholder="请输入开始时间"
                        suffix={<Icon type="icon-rili" />}
                    />
                    <span className="split-line" />
                    <Input
                        value={endTime}
                        onChange={(e) => {
                            setEndTime(e.target.value);
                        }}
                        placeholder="请输入结束时间"
                        suffix={<Icon type="icon-rili" />}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default WorkModal;
