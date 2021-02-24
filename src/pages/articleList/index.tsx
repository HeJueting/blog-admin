import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useHistory } from 'react-router-dom';
import articleAxios from '../../api/article';
import articleCategoryAxios from '../../api/articleCategory';
import { timeFormat } from '../../utils/help';
import lodash from '../../utils/lodash';
import { Select, Input, Pagination, InputNumber, Table, Modal } from 'antd';

const ArticleList: React.FC = () => {
    // 文章列表数据
    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            render: (value: string, data: any) => (
                <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`www.baidu.com/${data._id}`}
                >
                    {value}
                </a>
            ),
        },
        {
            title: '文章分类',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: '评论数量',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: '流量数量',
            dataIndex: 'look',
            key: 'look',
        },
        {
            title: '点赞数量',
            dataIndex: 'good',
            key: 'good',
        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (value: number) => timeFormat(value, 0),
        },
        {
            title: '',
            dataIndex: '',
            key: 'operate',
            width: '25%',
            render: (data: any) => (
                <div className="app-table-operate">
                    <span
                        className="operate-span"
                        onClick={() => {
                            editArticle(data);
                        }}
                    >
                        编辑
                    </span>
                    <span
                        className="operate-span"
                        onClick={() => {
                            deleteArticle(data);
                        }}
                    >
                        删除
                    </span>
                    <span className="split-line" />
                    <div className="weight-wrap">
                        <span className="operate-span">权重：</span>
                        <InputNumber
                            size="small"
                            min={-1000}
                            max={1000}
                            defaultValue={data.sort}
                            onChange={(value: any) => {
                                onSetWeight(value, data);
                            }}
                            onBlur={async () => {
                                await onBlur(data);
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
    // 文章分类
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('all');
    // 文章状态
    const stateList = [
        {
            value: 'all',
            name: '全部（状态）',
        },
        {
            value: 0,
            name: '草稿',
        },
        {
            value: 1,
            name: '已发布',
        },
    ];
    const [state, setState] = useState('all');
    // 排序
    const sortList = [
        {
            value: 'createAt',
            name: '创建时间',
        },
        {
            value: 'sort',
            name: '权重',
        },
        {
            value: 'look',
            name: '浏览量',
        },
        {
            value: 'good',
            name: '点赞量',
        },
    ];
    const [sort, setSort] = useState('createAt');
    // 关键字
    const [keyword, setKeyword] = useState('');
    // 分页
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    // 操作之前的权重
    const [hisSort, setHisSort] = useState(0);
    // 路由
    const history = useHistory();

    // 初始化文章分类数据（只请求一次）
    useEffect(() => {
        initCategoryList();
    }, []);
    // 初始化文章列表数据
    useEffect(() => {
        if (categoryList.length) {
            initDataSource();
        }
    }, [page, pageSize, sort, state, category, keyword, categoryList]);

    // 初始化文章列表
    const initDataSource = async () => {
        // 查询数据
        const res = await articleAxios.list({
            keyword,
            page,
            pageSize,
            sort,
            state: state === 'all' ? '' : state,
            category: category === 'all' ? '' : category,
        });

        // 查询数据成功
        if (res.code === 0) {
            const stateCn = ['草稿', '已发布', '已删除'];
            res.data.forEach((item: any, index: number) => {
                // 添加一个key值
                res.data[index].key = item._id;
                // 根据分类_id替换成分类名称
                const categoryIndex = lodash.findIndex(
                    categoryList,
                    (o: any) => o._id === item.categoryId
                );
                res.data[index].category = lodash.get(
                    categoryList[categoryIndex],
                    'name',
                    '暂未分类'
                );
                // 根据状态值，拿到状态的中文
                res.data[index].state = stateCn[item.state];
            });
            setDataSource(res.data);
            setTotal(res.total as number);
        }
    };

    // 初始化文章分类信息
    const initCategoryList = async () => {
        const res = await articleCategoryAxios.list();
        if (res.code === 0) {
            res.data.unshift({
                _id: 'all',
                name: '全部（文章分类）',
            });
            setCategoryList(res.data);
        } else {
            window.$message.error(res.msg);
        }
    };

    // 分类发生改变
    const categoryChange = (value: string) => {
        setPage(1);
        setCategory(value);
    };

    // 状态发生改变
    const stateChange = (value: any) => {
        setPage(1);
        setState(value);
    };

    // 排序发生改变
    const sortChange = (value: string) => {
        setPage(1);
        setSort(value);
    };

    // 关键字查询
    const search = (value: string) => {
        setPage(1);
        setKeyword(value);
    };

    // 页码变化
    const pageChange = (page: number) => {
        setPage(page);
    };

    // 页码变化
    const pageSizeChange = (page: number, size: number) => {
        setPage(1);
        setPageSize(size);
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
            const res = await articleAxios.update({
                _id: data._id,
                sort: data.sort,
            });
            if (res.code === 0) {
                window.$message.success('文章权重更新成功');
            }
            // 更新数据
            initDataSource();
        }
    };

    // 权重设置输入框获取焦点
    const onFocus = (data: any) => {
        setHisSort(data.sort);
    };

    // 点击编辑文章
    const editArticle = (data: any) => {
        history.push('/article/edit', data);
    };

    // 点击删除文章
    const deleteArticle = (data: any) => {
        Modal.confirm({
            title: '是否将该文章删除进入回收站？',
            onOk: async () => {
                const res = await articleAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success('文章删除成功');
                }
            },
        });
    };

    return (
        <div className="article-list">
            <div className={style['filter-wrap']}>
                <div className={style['filter-wrap-left']}>
                    <Select
                        className={style['select']}
                        value={category}
                        onChange={categoryChange}
                    >
                        {categoryList.map((item: any) => (
                            <Select.Option
                                key={`filter-category-${item._id}`}
                                value={item._id}
                            >
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                        className={style['select']}
                        value={state}
                        onChange={stateChange}
                    >
                        {stateList.map((item) => (
                            <Select.Option
                                key={`filter-state-${item.value}`}
                                value={item.value}
                            >
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                        className={style['select']}
                        value={sort}
                        onChange={sortChange}
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
                <div className="filter-wrap-right">
                    <Input.Search
                        className={style['search']}
                        placeholder="关键字查询"
                        onSearch={search}
                    />
                </div>
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
        </div>
    );
};

export default ArticleList;
