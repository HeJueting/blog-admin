import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { Button, InputNumber, Table, Modal } from 'antd';
import lodash from '../../utils/lodash';
import Icon from '../../components/icon';
import OperateModal from './operateModal';
import albumCategoryAxios from '../../api/albumCategory';

const AlbumCategory: React.FC = () => {
    // 相册分类列表数据
    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '分类描述',
            dataIndex: 'description',
            key: 'description',
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
                            clickEditCategory(data);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            clickDeleteCategory(data);
                        }}
                    >
                        删除
                    </span>
                    <span className="split-line" />
                    <div className="weight-wrap">
                        <span>权重：</span>
                        <InputNumber
                            min={-1000}
                            max={1000}
                            defaultValue={data.sort}
                            onChange={(value: any) => {
                                onSetWeight(value, data);
                            }}
                            onBlur={async () => {
                                onBlur(data);
                            }}
                            onFocus={() => {
                                onFocus(data);
                            }}
                        />
                    </div>
                </div>
            ),
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    // 弹窗
    const [operation, setOperation] = useState('create');
    const [visible, setVisible] = useState(false);
    const [defaultData, setDefaultData] = useState({} as any);
    // 历史权重值
    const [hisSort, setHisSort] = useState(0);

    // 请求相册分类信息
    const getCategoryList = async () => {
        const res = await albumCategoryAxios.searchList();
        // 查询数据成功
        if (res.code === 0) {
            res.data.forEach((item: any, index: number) => {
                // 添加一个key值
                res.data[index].key = item._id;
            });
            setDataSource(res.data);
        }
    };
    useEffect(() => {
        getCategoryList();
    }, []);

    // 点击新增
    const clickAddCategory = () => {
        setOperation('create');
        setVisible(true);
        setDefaultData({});
    };

    // 点击编辑
    const clickEditCategory = (data: any) => {
        setOperation('edit');
        setVisible(true);
        setDefaultData(data);
    };

    // 点击删除
    const clickDeleteCategory = (data: any) => {
        Modal.confirm({
            title: '是否删除该相册分类？',
            onOk: async () => {
                const res = await albumCategoryAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    window.$message.success(res.msg);
                    getCategoryList();
                }
            },
        });
    };

    // 权重设置
    const onSetWeight = (value: any, data: any) => {
        data.sort = value;
        setDataSource(lodash.cloneDeep(dataSource));
    };

    // 权重设置输入框失去焦点
    const onBlur = async (data: any) => {
        if (hisSort !== data.sort) {
            // 更新权重信息
            const res = await albumCategoryAxios.update({
                _id: data._id,
                sort: data.sort,
            });
            if (res.code === 0) {
                window.$message.success('相册权重更新成功');
            }
            // 重新拉取相册分类信息
            getCategoryList();
        }
    };

    // 权重设置输入框获取焦点
    const onFocus = (data: any) => {
        setHisSort(data.sort);
    };

    // 确认新增/编辑分类
    const handleOnCreateOrSave = async (params: any) => {
        let res;
        if (operation === 'create') {
            // 新增分类
            res = await albumCategoryAxios.create(params);
        } else {
            // 编辑分类
            res = await albumCategoryAxios.update({
                _id: defaultData._id,
                ...params,
            });
        }
        // 提示成功的信息
        if (res.code === 0) {
            window.$message.success(res.msg);
        }
        setVisible(false);
        getCategoryList();
    };

    return (
        <>
            <header className={style['category-header']}>
                <h3 className="module-title">相册分类</h3>
                <Button
                    onClick={clickAddCategory}
                    icon={
                        <Icon type="icon-add1" className={style['iconfont']} />
                    }
                    type="primary"
                >
                    新增
                </Button>
            </header>

            <Table
                bordered
                pagination={false}
                columns={columns}
                dataSource={dataSource}
            />

            {/* 新增、编辑分类的弹窗 */}
            {visible && (
                <OperateModal
                    operation={operation}
                    handleOk={handleOnCreateOrSave}
                    visible={visible}
                    setVisible={(visible: boolean) => {
                        setVisible(visible);
                    }}
                    defaultData={defaultData}
                />
            )}
        </>
    );
};

export default AlbumCategory;
