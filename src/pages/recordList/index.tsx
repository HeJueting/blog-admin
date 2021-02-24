import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useHistory } from 'react-router-dom';
import { Select, Input, Pagination, Table, Modal } from 'antd';
import recordAxios from '../../api/record';
import { timeFormat } from '../../utils/help';

const RecordList: React.FC = () => {
    // history
    const history = useHistory();
    // 生活列表数据
    const columns = [
        {
            title: '事件标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '发生时间',
            dataIndex: 'time',
            key: 'time',
            render: (value: any) => <span>{timeFormat(value, 0)}</span>,
        },
        {
            title: '事件概览',
            dataIndex: 'abstract',
            key: 'abstract',
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '10%',
            render: (data: any) => (
                <div className="app-table-operate">
                    <span
                        className="operate-span"
                        onClick={() => {
                            editOnClick(data);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            deleteOnClick(data);
                        }}
                    >
                        删除
                    </span>
                </div>
            ),
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    // 排序
    const [sort, setSort] = useState(-1);
    const sortList = [
        {
            value: -1,
            name: '创建时间(降序)',
        },
        {
            value: 1,
            name: '创建时间(升序)',
        },
    ];
    // 关键字
    const [keyword, setKeyword] = useState('');
    // 分页
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // 初始化数据列表
    const initDataSource = async () => {
        const res = await recordAxios.list({
            sort,
            keyword,
            page,
            pageSize,
        });
        // 增加key值
        res.data.forEach((item: any, index: number) => {
            res.data[index].key = item._id;
        });
        setDataSource(res.data);
        setTotal(res.count as number);
    };
    useEffect(() => {
        initDataSource();
    }, [page, pageSize, sort, keyword]);

    // 排序发生改变
    const sortChange = (value: any) => {
        setPage(1);
        setSort(value);
    };

    // 关键字查询
    const search = (value: any) => {
        setPage(1);
        setKeyword(value);
    };

    // 页码变化
    const pageChange = (page: number) => {
        setPage(page);
    };

    // 页码变化
    const pageSizeChange = (current: number, size: number) => {
        setPage(1);
        setPageSize(size);
    };

    // 点击编辑
    const editOnClick = (data: any) => {
        history.push('/record/edit', data);
    };

    // 点击删除
    const deleteOnClick = (data: any) => {
        Modal.confirm({
            title: '是否删除该生活记录？',
            onOk: async () => {
                const res = await recordAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success('删除成功');
                }
            },
        });
    };

    return (
        <>
            <div className={style['filter-wrap']}>
                <Select
                    value={sort}
                    onChange={sortChange}
                    className={style['select']}
                >
                    {sortList.map((item) => (
                        <Select.Option
                            key={`filter-sort-${item.name}`}
                            value={item.value}
                        >
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
                <Input.Search
                    className={style['search']}
                    placeholder="标题关键字查询"
                    onSearch={search}
                />
            </div>
            <Table
                bordered
                pagination={false}
                columns={columns}
                dataSource={dataSource}
            />
            <Pagination
                className="app-table-pagination"
                onChange={pageChange}
                pageSize={pageSize}
                showSizeChanger
                onShowSizeChange={pageSizeChange}
                current={page}
                total={total}
            />
        </>
    );
};

export default RecordList;
