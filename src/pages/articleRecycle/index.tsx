import React, { useState, useEffect } from 'react';
import { Pagination, Table, Modal } from 'antd';
import articleAxios from '../../api/article';
import { timeFormat } from '../../utils/help';

const ArticleRecycle: React.FC = () => {
    // 文章列表数据
    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '文章摘要',
            dataIndex: 'abstract',
            key: 'abstract',
            textWrap: 'word-break',
            ellipsis: true,
            width: '55%',
        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            width: '12%',
            render: (value: string | number) => timeFormat(value, 0),
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '12%',
            render: (data: any) => (
                <div className="app-table-operate">
                    <span
                        className="operate-span"
                        onClick={() => {
                            recovery(data);
                        }}
                    >
                        恢复
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            cleanUp(data);
                        }}
                    >
                        清除
                    </span>
                </div>
            ),
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    // 分页
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // 初始化文章列表
    const initDataSource = async () => {
        // 查询数据
        const res = await articleAxios.list({
            page,
            pageSize,
            state: 2,
        });
        // 查询数据成功
        if (res.code === 0) {
            res.data.forEach((item: any, index: number) => {
                // 添加一个key值
                res.data[index].key = item._id;
            });
            setDataSource(res.data);
            setTotal(res.total as number);
        }
    };
    useEffect(() => {
        initDataSource();
    }, [page, pageSize]);

    // 恢复
    const recovery = async (data: any) => {
        Modal.confirm({
            title: '是否将该文章恢复为草稿状态？',
            onOk: async () => {
                const res = await articleAxios.update({
                    _id: data._id,
                    state: 0,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success('文章已恢复至文章列表中');
                }
            },
        });
    };

    // 彻底清除
    const cleanUp = async (data: any) => {
        Modal.confirm({
            title: '是否彻底删除该文章？',
            onOk: async () => {
                const res = await articleAxios.destroy({
                    _id: data._id,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success('文章已彻底删除');
                }
            },
        });
    };

    // 页码变化
    const pageChange = (page: number) => {
        setPage(page);
    };

    // 页码变化
    const pageSizeChange = (page: number, size: number) => {
        setPage(page);
        setPageSize(size);
    };

    return (
        <>
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

export default ArticleRecycle;
