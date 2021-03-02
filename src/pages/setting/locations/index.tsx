import React, { useState, useEffect } from 'react';
import style from '../style.module.scss';
import lodash from '../../../utils/lodash';
import { Modal, Input, Button, Table } from 'antd';
import locationAxios from '../../../api/location';
import { timeFormat } from '../../../utils/help';

const Locations: React.FC = () => {
    // 经纬度信息
    const columns = [
        {
            title: '地理名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '经度',
            dataIndex: 'lat',
            key: 'lat',
        },
        {
            title: '维度',
            dataIndex: 'lng',
            key: 'lng',
            ellipsis: true,
        },
        {
            title: '当日时间',
            dataIndex: 'time',
            key: 'time',
            ellipsis: true,
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            render: (data: any) => (
                <div className="app-table-operate">
                    <span
                        className="operate-span"
                        onClick={() => {
                            onEdit(data);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            onDelete(data);
                        }}
                    >
                        删除
                    </span>
                </div>
            ),
        },
    ];
    // 数据源
    const [dataSource, setDataSource] = useState<any[]>([]);
    // 弹窗
    const [visible, setVsible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [lat, setLat] = useState<string>('');
    const [lng, setLng] = useState<string>('');
    const [time, setTime] = useState<string>('');
    // 当前被编辑的地理信息id
    const [id, setId] = useState<string>('');

    // 初始化数据源
    const initDataSource = async () => {
        const res = await locationAxios.search();
        if (res.code === 0) {
            res.data.forEach((item: any, index: number) => {
                item.key = item.time + index;
                item.time = timeFormat(item.time, 0);
            });
            setDataSource(res.data);
        }
    };
    useEffect(() => {
        initDataSource();
    }, []);

    // 点击确定
    const onOk = async () => {
        const creatAt = +new Date(time);
        if (!name) {
            window.$message.error('请输入地理名称！');
        } else if (!lng) {
            window.$message.error('请输入地理经度！');
        } else if (!lat) {
            window.$message.error('请输入地理纬度！');
        } else if (creatAt < 0 || String(creatAt) === 'NaN') {
            window.$message.error('时间格式有误');
        } else {
            let res = {};
            if (isEdit) {
                res = await locationAxios.update({
                    id,
                    data: {
                        time: +new Date(time),
                        name,
                        lng,
                        lat,
                    },
                });
            } else {
                res = await locationAxios.create({
                    time: +new Date(time),
                    name,
                    lng,
                    lat,
                });
            }
            if (lodash.get(res, 'code') === 0) {
                onCancel();
                initDataSource();
                window.$message.success(`${isEdit ? '保存' : '新增'}成功`);
            }
        }
    };
    // 点击取消
    const onCancel = () => {
        setVsible(false);
        setName('');
        setLat('');
        setLng('');
    };
    // 点击编辑
    const onEdit = (data: any) => {
        setName(data.name);
        setLat(data.lat);
        setLng(data.lng);
        setTime(data.time);
        setId(data._id);
        setIsEdit(true);
        setVsible(true);
    };
    // 点击删除
    const onDelete = async (data: any) => {
        Modal.confirm({
            title: '是否删除该地理信息？',
            onOk: async () => {
                const res = await locationAxios.delete({
                    id: data._id,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success(res.msg);
                }
            },
        });
    };
    // 点击新增
    const onAdd = () => {
        setIsEdit(false);
        setVsible(true);
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>地理信息配置</h3>
                <Button onClick={onAdd} type="primary">
                    新增
                </Button>
            </div>

            <Table
                bordered
                pagination={false}
                columns={columns}
                dataSource={dataSource}
            />

            <Modal
                title={`${isEdit ? '编辑' : '新增'}地理信息`}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                width="30%"
            >
                <div className={`title-form-wrap ${style['title-form-wrap']}`}>
                    <h6>地理名称</h6>
                    <Input
                        className="app-input"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        placeholder="请输入地理名称"
                    />
                </div>
                <div className={`title-form-wrap ${style['title-form-wrap']}`}>
                    <h6>地理经度</h6>
                    <Input
                        className="app-input"
                        value={lng}
                        onChange={(e) => {
                            setLng(e.target.value);
                        }}
                        placeholder="请输入地理经度"
                    />
                </div>
                <div className={`title-form-wrap ${style['title-form-wrap']}`}>
                    <h6>地理纬度</h6>
                    <Input
                        className="app-input"
                        value={lat}
                        onChange={(e) => {
                            setLat(e.target.value);
                        }}
                        placeholder="请输入地理维度"
                    />
                </div>
                <div className={`title-form-wrap ${style['title-form-wrap']}`}>
                    <h6>当日时间</h6>
                    <Input
                        className="app-input"
                        value={time}
                        onChange={(e) => {
                            setTime(e.target.value);
                        }}
                        placeholder="当日时间"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Locations;
