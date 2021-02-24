import React, { useState, useEffect } from 'react';
import lodash from '../../../../utils/lodash';
import { Input, Modal } from 'antd';
import Icon from '../../../../components/icon';
import style from '../style.module.scss';

// 接口：props
interface IEduModalProps {
    type: string;
    visible: boolean;
    data: {
        school?: string;
        major?: string;
        diploma?: string;
        startTime?: string;
        endTime?: string;
    };
    setVisible: (visible: boolean) => void;
    onOk: (...params: any) => void;
}

const EduModal: React.FC<IEduModalProps> = ({
    visible,
    type,
    data,
    setVisible,
    onOk,
}) => {
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');
    const [diploma, setDiploma] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        setSchool(lodash.get(data, 'school', ''));
        setMajor(lodash.get(data, 'major', ''));
        setDiploma(lodash.get(data, 'diploma', ''));
        setStartTime(lodash.get(data, 'startTime', ''));
        setEndTime(lodash.get(data, 'endTime', ''));
    }, []);

    // 清空表单内容
    const clearInput = () => {
        setSchool('');
        setMajor('');
        setDiploma('');
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
        if (!school) {
            window.$message.error('请输入就读学校');
        } else if (!major) {
            window.$message.error('请输入所学专业');
        } else if (!diploma) {
            window.$message.error('请输入毕业文凭');
        } else if (!startTime) {
            window.$message.error('请输入开始时间');
        } else {
            onOk({
                key: 'eduDataSource',
                type,
                defaultData: data,
                school,
                major,
                diploma,
                startTime,
                endTime,
            });
            cancel();
        }
    };

    return (
        <Modal
            title={`${type === 'create' ? '新增' : '编辑'}教育履历`}
            visible={visible}
            onOk={Ok}
            onCancel={cancel}
            width="60vw"
            okText="确认"
            cancelText="取消"
            className="user-info-other-modal"
        >
            <div className="title-form-wrap">
                <h6>学校</h6>
                <Input
                    className="form-right"
                    value={school}
                    onChange={(e) => {
                        setSchool(e.target.value);
                    }}
                    placeholder="请输入就读学校"
                    suffix={<Icon type="icon-icon-school" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>专业</h6>
                <Input
                    className="form-right"
                    value={major}
                    onChange={(e) => {
                        setMajor(e.target.value);
                    }}
                    placeholder="请输入所学专业"
                    suffix={<Icon type="icon-zhuanyequanwei" />}
                />
            </div>
            <div className={`${style['title-form-wrap']} title-form-wrap`}>
                <h6>文凭</h6>
                <Input
                    className="form-right"
                    value={diploma}
                    onChange={(e) => {
                        setDiploma(e.target.value);
                    }}
                    placeholder="请输入毕业文凭"
                    suffix={<Icon type="icon-xueli" />}
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

export default EduModal;
