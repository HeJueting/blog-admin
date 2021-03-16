import React, { useState, useEffect, useCallback } from 'react';
import style from './style.module.scss';
import { Select, Input, Pagination, Table, Modal } from 'antd';
import commentAxios from '../../api/comment';
import { timeFormat } from '../../utils/help';
import Prism from 'prismjs';
import '../../assets/styles/code-highlighter.css';

const CommentList: React.FC = () => {
    // 文章列表数据
    const columns = [
        {
            title: '来源',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '昵称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '时间',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (value: any) => timeFormat(value, 0),
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
                            deleteOnClick(data);
                        }}
                    >
                        删除
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            checkOnClick(data);
                        }}
                    >
                        查看
                    </span>
                </div>
            ),
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    // 评论分类
    const categoryList = [
        {
            value: 'all',
            name: '全部（来源）',
        },
        {
            value: 0,
            name: '文章',
        },
        {
            value: 1,
            name: '相册',
        },
        {
            value: 2,
            name: '留言板',
        },
        {
            value: 3,
            name: '建议',
        },
    ];
    const [category, setCategory] = useState('all');
    // 排序
    const [sort, setSort] = useState(-1);
    const sortList = [
        {
            value: -1,
            name: '时间（降序）',
        },
        {
            value: 1,
            name: '时间（升序）',
        },
    ];
    // 关键字
    const [keyword, setKeyword] = useState('');
    // 分页
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // 初始化数据
    const initDataSource = useCallback(async () => {
        const condition: any = {
            sort,
            page,
            pageSize,
            keyword,
        };
        if (category !== 'all') {
            condition.category = category;
        }
        const res = await commentAxios.searchCommentList(condition);
        if (res.code === 0) {
            const stateCn = ['文章', '相册', '留言板', '建议'];
            res.data.forEach((item: any, index: number) => {
                // 添加一个key值
                res.data[index].key = item._id;
                // 根据状态值，拿到状态的中文
                res.data[index].category = stateCn[item.category];
            });
            setDataSource(res.data);
            setTotal(res.total as number);
        }
    }, [page, pageSize, category, keyword, sort]);
    useEffect(() => {
        initDataSource();
    }, [initDataSource]);

    // 分类发生改变
    const categoryChange = (value: any) => {
        setPage(1);
        setCategory(value);
    };
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
    const pageSizeChange = (current: any, size: any) => {
        setPage(1);
        setPageSize(size);
    };

    // 点击删除
    const deleteOnClick = (data: any) => {
        Modal.confirm({
            title: '是否删除该条评论？',
            onOk: async () => {
                const res = await commentAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success(res.msg);
                }
            },
        });
    };
    // 点击查看
    const checkOnClick = (data: any) => {
        Modal.info({
            width: '40%',
            content: (
                <div
                    className={style['content']}
                    dangerouslySetInnerHTML={{
                        __html: data.html.replace(/<br\s*\/?>/g, '\n'),
                    }}
                />
            ),
            closable: true,
            icon: '',
            okButtonProps: {
                style: {
                    display: 'none',
                },
            },
        });
        process.nextTick(() => {
            Prism.highlightAll();
        });
    };

    return (
        <>
            <div className={style['filter-wrap']}>
                <div>
                    <Select
                        value={category}
                        onChange={categoryChange}
                        className={style['select']}
                    >
                        {categoryList.map((item) => (
                            <Select.Option
                                key={`filter-category-${item.value}`}
                                value={item.value}
                            >
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        value={sort}
                        onChange={sortChange}
                        className={style['select']}
                    >
                        {sortList.map((item) => (
                            <Select.Option
                                key={`filter-sort-${item.value}`}
                                value={item.value}
                            >
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
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

export default CommentList;
