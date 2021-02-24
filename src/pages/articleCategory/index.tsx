import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import lodash from '../../utils/lodash';
import { Button, Tree, InputNumber, Modal } from 'antd';
import OperateModal from './operateModal';
import Icon from '../../components/icon';
import articleCategoryAxios from '../../api/articleCategory';

const ArticleCategory: React.FC = () => {
    // 数据
    const [treeData, setTreeData] = useState([]);
    // 弹窗
    const [operation, setOperation] = useState('create');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDefaultData, setModalDefaultData] = useState({});
    // 操作之前的权重
    const [hisSort, setHisSort] = useState(0);

    // 得到分类信息
    const getCategoryList = async () => {
        // 发起请求
        const res = await articleCategoryAxios.list();
        // 构造treeData数据
        let treeData = lodash.cloneDeep(res.data);
        // 如果有数据
        if (treeData.length) {
            // 给所有treeData元素添加一个key值
            treeData.forEach((treeChild: any, index: number) => {
                treeData[index].key = `${treeChild.parentId}-${treeChild.name}`;
            });
            // 找到最大的level值
            let maxLevel = treeData.sort(
                (a: any, b: any) => b.level - a.level
            )[0].level;
            // 递归赋值（先将3层分类复制children给2层分类，再删除所有3层分类，以此类推）
            while (maxLevel > 0) {
                // 该level层所有数据
                const levelData = treeData.filter(
                    (item: any) => item.level === maxLevel
                );
                // 在treeData上删除这个level所有数据
                treeData = treeData.filter(
                    (item: any) => item.level !== maxLevel
                );
                // 该level层所有数据以children形式push进入treeData中
                levelData.forEach((child: any) => {
                    const index = lodash.findIndex(
                        treeData,
                        (tree: any) => tree._id === child.parentId
                    );
                    if (!treeData[index].children) {
                        treeData[index].children = [];
                    }
                    treeData[index].children.push(lodash.cloneDeep(child));
                });
                maxLevel -= 1;
            }
        }
        setTreeData(treeData);
    };
    useEffect(() => {
        getCategoryList();
    }, []);

    // 点击删除分类
    const clickOnDelete = (data: any) => {
        Modal.confirm({
            title: '确认删除该分类？',
            content: '如果该分类下有子分类，所有的子分类也将被删除',
            onOk: async () => {
                // 删除文章分类
                const res = await articleCategoryAxios.delete({
                    _id: data._id,
                });
                if (res.code === 0) {
                    window.$message.success(res.msg);
                }
                // 重新请求数据
                getCategoryList();
            },
        });
    };

    // 点击编辑分类
    const clickOnEdit = (data: any) => {
        setOperation('edit');
        setModalVisible(true);
        setModalDefaultData(data);
    };

    // 点击新增分类（子分类）
    const clickOnCreateChild = (data: any) => {
        setOperation('create');
        setModalVisible(true);
        setModalDefaultData({
            parentId: data._id,
        });
    };

    // 点击新增分类（父分类）
    const clickOnCreateParent = () => {
        setOperation('create');
        setModalVisible(true);
        setModalDefaultData({});
    };

    // 确认新增/编辑分类
    const handleOnCreateOrSave = async (params: any) => {
        let res;
        if (operation === 'create') {
            // 新增分类
            res = await articleCategoryAxios.create(params);
        } else {
            // 编辑分类
            res = await articleCategoryAxios.update({
                _id: lodash.get(modalDefaultData, '_id'),
                ...params,
            });
        }
        // 提示成功的信息
        if (res.code === 0) {
            window.$message.success(res.msg);
        }
        setModalVisible(false);
        // 重新拉取数据
        getCategoryList();
    };

    // 权重设置
    const onSetWeight = (value: any, data: any) => {
        data.sort = value;
        setTreeData(lodash.cloneDeep(treeData));
    };

    // 权重设置输入框失去焦点
    const onBlur = async (data: any) => {
        if (hisSort !== data.sort) {
            // 更新权重信息
            const res = await articleCategoryAxios.update({
                _id: data._id,
                sort: data.sort,
            });
            if (res.code === 0) {
                window.$message.success('文章权重更新成功');
            }
            // 重新拉取文章分类信息
            getCategoryList();
        }
    };

    // 权重设置输入框获取焦点
    const onFocus = (data: any) => {
        setHisSort(data.sort);
    };

    return (
        <>
            {/* 分类头部 */}
            <header className={style['category-header']}>
                <h3 className="module-title">文章分类</h3>
                <Button
                    className={style['btn']}
                    onClick={clickOnCreateParent}
                    icon={<Icon type="icon-add1" className={style['icon']} />}
                    type="primary"
                >
                    新增
                </Button>
            </header>
            <Tree
                blockNode
                selectable={false}
                treeData={treeData}
                titleRender={(data: any) => (
                    <div className={style['tree-title']}>
                        <h6>{data.name}</h6>
                        <div className="app-table-operate">
                            <span
                                className="operate-span"
                                onClick={() => {
                                    clickOnCreateChild(data);
                                }}
                            >
                                新增
                            </span>
                            <span
                                className="operate-span"
                                onClick={() => {
                                    clickOnEdit(data);
                                }}
                            >
                                编辑
                            </span>
                            <span
                                className="operate-span"
                                onClick={() => {
                                    clickOnDelete(data);
                                }}
                            >
                                删除
                            </span>
                            <span className="split-line" />
                            <div className="weight-wrap">
                                <span className="operate-span">权重：</span>
                                <InputNumber
                                    min={-1000}
                                    max={1000}
                                    value={data.sort}
                                    onChange={(value) => {
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
                    </div>
                )}
            />

            {/* 新增、编辑分类的弹窗 */}
            {modalVisible && (
                <OperateModal
                    operation={operation}
                    handleOk={handleOnCreateOrSave}
                    visible={modalVisible}
                    setVisible={(visible) => {
                        setModalVisible(visible);
                    }}
                    defaultData={modalDefaultData}
                />
            )}
        </>
    );
};

export default ArticleCategory;
