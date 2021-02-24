import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import lodash from '../../../utils/lodash';
import userAxios from '../../../api/user';

import { Button, Modal, Table } from 'antd';
import EduModal from './eduModal';
import WorkModal from './workModal';
import CertificateModal from './certificateModal';

// 接口：确认操作
interface IHandleOnOk {
    (data: {
        key: string;
        type: string;
        defaultData: any;
        name: string;
        number: string;
        time: string;
    }): void;
}

const Other: React.FC = () => {
    // 用户id
    const [userId, setUserId] = useState('');
    // 教育履历
    const eduColumns = [
        {
            title: '学校',
            dataIndex: 'school',
            key: 'school',
        },
        {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        },
        {
            title: '文凭',
            dataIndex: 'diploma',
            key: 'diploma',
        },
        {
            title: '起止时间',
            dataIndex: 'time',
            key: 'time',
            render: (text: any, record: any) => (
                <span>{`${record.startTime} - ${
                    record.endTime || '至今'
                }`}</span>
            ),
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '10%',
            render: (text: any, record: any, index: number) => (
                <div className="table-operate">
                    <span
                        onClick={() => {
                            setEduModalVisible(true);
                            setEduModalType('edit');
                            setEduModalData(record);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        onClick={() => {
                            handleDelete('eduDataSource', index);
                        }}
                    >
                        删除
                    </span>
                </div>
            ),
        },
    ];
    const [eduDataSource, setEduDataSource] = useState([]);
    const [eduModalVisible, setEduModalVisible] = useState(false);
    const [eduModalData, setEduModalData] = useState({});
    const [eduModalType, setEduModalType] = useState('create');

    // 工作经历
    const workColumns = [
        {
            title: '公司名称',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: '工作岗位',
            dataIndex: 'job',
            key: 'job',
        },
        {
            title: '工作地点',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '起止时间',
            dataIndex: 'time',
            key: 'time',
            render: (text: any, record: any) => (
                <span>{`${record.startTime} - ${
                    record.endTime || '至今'
                }`}</span>
            ),
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '10%',
            render: (text: any, record: any, index: number) => (
                <div className="table-operate">
                    <span
                        onClick={() => {
                            setWorkModalVisible(true);
                            setWorkModalType('edit');
                            setWorkModalData(record);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        onClick={() => {
                            handleDelete('workDataSource', index);
                        }}
                    >
                        删除
                    </span>
                </div>
            ),
        },
    ];
    const [workDataSource, setWorkDataSource] = useState([]);
    const [workModalVisible, setWorkModalVisible] = useState(false);
    const [workModalData, setWorkModalData] = useState({});
    const [workModalType, setWorkModalType] = useState('create');

    // 技能证书
    const certificateColumns = [
        {
            title: '证书名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '证书编号',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '获取时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '10%',
            render: (text: any, record: any, index: number) => (
                <div className="table-operate">
                    <span
                        onClick={() => {
                            setCertificateModalVisible(true);
                            setCertificateModalType('edit');
                            setCertificateModalData(record);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        onClick={async () => {
                            handleDelete('certificateDataSource', index);
                        }}
                    >
                        删除
                    </span>
                </div>
            ),
        },
    ];
    const [certificateDataSource, setCertificateDataSource] = useState([]);
    const [certificateModalVisible, setCertificateModalVisible] = useState(
        false
    );
    const [certificateModalData, setCertificateModalData] = useState({});
    const [certificateModalType, setCertificateModalType] = useState('create');

    // 字段映射
    const dataMap: { [key: string]: any } = {
        eduDataSource,
        workDataSource,
        certificateDataSource,
    };
    const keyMap: { [key: string]: string } = {
        eduDataSource: 'educationRecord',
        workDataSource: 'workRecord',
        certificateDataSource: 'certificateRecord',
    };

    // 初始化页面数据
    const initData = async () => {
        const res = await userAxios.getUserInfo();
        const { certificateRecord, educationRecord, workRecord } = res.data;
        // 设置用户id
        setUserId(res.data._id);
        // 新增一个key属性
        educationRecord.forEach((item: any, index: number) => {
            educationRecord[index].key = `educationRecord-${index}`;
        });
        workRecord.forEach((item: any, index: number) => {
            workRecord[index].key = `workRecord-${index}`;
        });
        certificateRecord.forEach((item: any, index: number) => {
            certificateRecord[index].key = `certificateRecord-${index}`;
        });
        // 更新数据
        setEduDataSource(educationRecord);
        setWorkDataSource(workRecord);
        setCertificateDataSource(certificateRecord);
    };
    useEffect(() => {
        initData();
    }, []);

    // 确定添加: 教育履历 or 工作履历 or 技能证书
    const handleOk: IHandleOnOk = async ({
        key,
        type,
        defaultData,
        ...data
    }) => {
        // 找到当前需要操作的数据
        let recordData: any[] = lodash.cloneDeep(dataMap[key]);
        // 新增or编辑
        if (type === 'create') {
            // 删减key属性
            recordData.forEach((item, index) => {
                recordData[index] = lodash.omit(item, ['key']);
            });
            // 插入这条数据
            recordData.push(data);
        } else {
            // 找到需要更新的这条数据位置
            const location = lodash.findIndex(recordData, defaultData);
            // 删减key属性
            recordData.forEach((item, index) => {
                recordData[index] = lodash.omit(item, ['key']);
            });
            recordData[location] = data;
        }
        // 数据更新
        const body: { [key: string]: any } = {};
        body[keyMap[key]] = recordData;
        const res = await userAxios.updateUserInfo({
            _id: userId,
            data: body,
        });
        if (res.code === 0) {
            initData();
            window.$message.success(
                `${type === 'create' ? '新增' : '更新'}成功`
            );
        }
    };

    // 确认删除: 教育履历 or 工作履历 or 技能证书
    const handleDelete = async (key: string, index: number) => {
        Modal.confirm({
            title: '是否删除这条数据?',
            width: '30%',
            onOk: async () => {
                // 找到这组数据,并删除这条数据
                const record = lodash.cloneDeep(dataMap[key]);
                record.splice(index, 1);
                // 数据更新
                const body: { [key: string]: any } = {};
                body[keyMap[key]] = record;
                const res = await userAxios.updateUserInfo({
                    _id: userId,
                    data: body,
                });
                if (res.code === 0) {
                    initData();
                    window.$message.success('删除成功');
                }
            },
        });
    };

    return (
        <div className={style['other-info']}>
            <div className={style['wrap']}>
                <div className={style['wrap-header']}>
                    <h5>教育履历</h5>
                    <Button
                        type="primary"
                        onClick={() => {
                            setEduModalVisible(true);
                            setEduModalType('create');
                            setEduModalData({});
                        }}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    pagination={false}
                    columns={eduColumns}
                    dataSource={eduDataSource}
                />
            </div>

            <div className={style['wrap']}>
                <div className={style['wrap-header']}>
                    <h5>工作经历</h5>
                    <Button
                        type="primary"
                        onClick={() => {
                            setWorkModalVisible(true);
                            setWorkModalType('create');
                            setWorkModalData({});
                        }}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    pagination={false}
                    columns={workColumns}
                    dataSource={workDataSource}
                />
            </div>

            <div className={style['wrap']}>
                <div className={style['wrap-header']}>
                    <h5>技能证书</h5>
                    <Button
                        type="primary"
                        onClick={() => {
                            setCertificateModalVisible(true);
                            setCertificateModalType('create');
                            setCertificateModalData({});
                        }}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    pagination={false}
                    columns={certificateColumns}
                    dataSource={certificateDataSource}
                />
            </div>

            {/* 教育履历弹窗 */}
            {eduModalVisible && (
                <EduModal
                    visible={eduModalVisible}
                    data={eduModalData}
                    type={eduModalType}
                    setVisible={(visible: boolean) => {
                        setEduModalVisible(visible);
                    }}
                    onOk={handleOk}
                />
            )}

            {/* 工作经历弹窗 */}
            {workModalVisible && (
                <WorkModal
                    visible={workModalVisible}
                    data={workModalData}
                    type={workModalType}
                    setVisible={(visible: boolean) => {
                        setWorkModalVisible(visible);
                    }}
                    onOk={handleOk}
                />
            )}

            {/* 技能证书弹窗 */}
            {certificateModalVisible && (
                <CertificateModal
                    visible={certificateModalVisible}
                    data={certificateModalData}
                    type={certificateModalType}
                    setVisible={(visible: boolean) => {
                        setCertificateModalVisible(visible);
                    }}
                    onOk={handleOk}
                />
            )}
        </div>
    );
};

export default Other;
