import React, { useState, useEffect, useCallback } from 'react';
import style from './style.module.scss';
import './style.scss';
import axios from 'axios';
import localForage from 'localforage';
import minioAxios from '../../api/minio';
import CONFIG from '../../config';
import { timeFormat } from '../../utils/help';
import lodash from 'lodash';

import { Button, Modal } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Icon from '../../components/icon';
import Upload from '../../components/upload';
import BucketModal from './bucketModal';
import FolderModal from './folderModal';

const UserCloud: React.FC = () => {
    // 当前存储的资源
    const [resourceList, setResourceList] = useState([]);
    // 存储桶的路径匹配
    const [pathList, setPathList] = useState([
        {
            name: 'root',
            prefix: '',
        },
    ]);
    // 上传资源的弹窗
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    // 创建存储桶的弹窗
    const [bucketModalVisible, setBucketModalVisible] = useState(false);
    const [bucketModalDefaultData, setBucketModalDefaultData] = useState({});
    const [bucketModalOperation, setBucketModalOperation] = useState('create');
    // 创建文件夹的弹窗
    const [folderModalVisible, setFolderModalVisible] = useState(false);
    // 右键操作对象
    let contextMenuData: any = null;

    // 初始化file和folder信息
    const initDataSource = useCallback(async () => {
        let res: any;
        const bucketName = lodash.get(pathList, '[1].name', '');
        const bucketPrefix = lodash.get(lodash.last(pathList), 'prefix', '');
        if (bucketName) {
            res = await minioAxios.searchBucketObjects({
                bucketName,
                prefix: bucketPrefix,
            });
            res.data.forEach((item: any, index: number) => {
                if (!res.data[index].name) {
                    res.data[index].folderName = lodash.last(
                        lodash.dropRight(res.data[index].prefix.split('/'), 1)
                    );
                } else {
                    res.data[index].fileName = lodash.last(
                        res.data[index].name.split('/')
                    );
                }
            });
        } else {
            res = await minioAxios.searchBucket();
            res.data.forEach((item: any, index: number) => {
                res.data[index].folderName = res.data[index].name;
                res.data[index].bucketName = res.data[index].name;
            });
        }
        setResourceList(res.data);
    }, [pathList]);
    // pathList更新后，重新请求数据
    useEffect(() => {
        initDataSource();
    }, [initDataSource]);

    // 文件、文件夹：鼠标事件
    const resourceOnClick = (e: any, data: any) => {
        e.stopPropagation();
        // 左键（0）、右键（2）
        if (e.button === 0 && data.folderName) {
            const newPathList = lodash.cloneDeep(pathList);
            newPathList.push({
                name: data.folderName,
                prefix: data.bucketName ? '' : data.prefix,
            });
            setPathList(newPathList);
        } else if (e.button === 2) {
            contextMenuData = data;
        }
    };
    // 路径跳转
    const switchPath = (name: string) => {
        const index = lodash.findIndex(pathList, (item) => item.name === name);
        const delNumber = pathList.length - 1 - index;
        // 如果资源路径有更新
        if (delNumber > 0) {
            const newPathList = lodash.dropRight(
                lodash.cloneDeep(pathList),
                delNumber
            );
            setPathList(newPathList);
        }
    };

    // 文件夹：权限设置操作
    const folderLimitOnClick = () => {
        const defaultData = lodash.cloneDeep(contextMenuData);
        setBucketModalVisible(true);
        setBucketModalOperation('edit');
        setBucketModalDefaultData(defaultData);
    };

    // 文件夹：右键点击删除
    const folderDeleteOnClick = async () => {
        const isBucket = !!contextMenuData.bucketName;
        const title = isBucket ? '存储桶' : '文件夹';
        Modal.confirm({
            title: `是否删除该${title}？删除后该${title}中的所有资源都将清除`,
            width: '30%',
            onOk: async () => {
                // 删除存储桶 or 删除对象
                let res;
                if (isBucket) {
                    const { bucketName } = contextMenuData;
                    res = await minioAxios.deleteBucket({
                        name: bucketName,
                    });
                } else {
                    const bucketName = lodash.get(pathList, '[1].name', '');
                    const { prefix } = contextMenuData;
                    res = await minioAxios.deleteFolder({
                        name: bucketName,
                        prefix,
                    });
                }
                // 删除成功
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success(res.msg);
                }
            },
        });
    };

    // 文件：右键点击查看
    const fileCheckOnClick = () => {
        const { name, lastModified } = contextMenuData;
        const bucketName = lodash.get(pathList, '[1].name', '');
        const url = `${
            CONFIG.FILE_REQUEST_PATH
        }/${bucketName}/${encodeURIComponent(name)}`;
        Modal.success({
            width: '30%',
            icon: '',
            className: style['user-cloud-fileCheck-modal'],
            content: (
                <>
                    <div className={style['fileCheck-modal-wrap']}>
                        <h6>URL地址</h6>
                        <p>{url}</p>
                    </div>
                    <div className={style['fileCheck-copy-wrap']}>
                        <span
                            onClick={() => {
                                copyUrl(url);
                            }}
                        >
                            复制
                        </span>
                    </div>
                    <div className={style['fileCheck-modal-wrap']}>
                        <h6>创建时间</h6>
                        <p>{timeFormat(lastModified, 1)}</p>
                    </div>
                </>
            ),
        });
    };

    // 复制文件超链接
    const copyUrl = (url: string) => {
        const input = document.createElement('input');
        input.setAttribute('value', url);
        input.setAttribute('style', 'z-index: -1;');
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        window.$message.success('复制成功');
        document.body.removeChild(input);
    };

    // 文件：右键点击删除
    const fileDeleteOnClick = () => {
        Modal.confirm({
            title: '是否删除该文件？',
            width: '30%',
            onOk: async () => {
                const bucketName = lodash.get(pathList, '[1].name', '');
                const { name } = contextMenuData;
                const res = await minioAxios.deleteFile({
                    bucketName,
                    objectName: name,
                });
                if (res.code === 0) {
                    initDataSource();
                    window.$message.success(res.msg);
                }
            },
        });
    };

    // 全局：右键点击新建 存储桶 or 文件夹
    const newFolderOnClick = () => {
        const isBucket = !(pathList.length > 1);
        // 新建存储桶
        if (isBucket) {
            setBucketModalVisible(true);
            setBucketModalOperation('create');
        } else {
            setFolderModalVisible(true);
        }
    };

    // 确认新建 or 编辑存储桶
    const handleBucketOk = async (data: any) => {
        const { name, purview, password } = data;
        let res;
        // 创建or保存
        if (bucketModalOperation === 'create') {
            res = await minioAxios.createBucket({
                name,
                purview,
                password,
            });
        } else {
            res = await minioAxios.updateBucket({
                name,
                purview,
                password,
            });
        }
        // 操作成功
        if (res.code === 0) {
            setBucketModalVisible(false);
            initDataSource();
            window.$message.success(res.msg);
        }
    };

    // 确认新建文件夹
    const handleFolderOk = (data: any) => {
        const newPathList = lodash.cloneDeep(pathList);
        const prefix = `${lodash.get(lodash.last(newPathList), 'prefix')}${
            data.name
        }/`;
        newPathList.push({
            name: data.name,
            prefix,
        });
        setResourceList([]);
        setPathList(newPathList);
        setFolderModalVisible(false);
    };

    // mongodb数据与minio中的存储桶信息同步
    const asyncBucket = async () => {
        const res = await minioAxios.asyncBucket();
        if (res.code !== -1) {
            initDataSource();
            window.$message.success(res.msg);
        }
    };

    // 一键导出
    const resourceExport = async () => {
        // 请求zip压缩包
        const token = await localForage.getItem('token');
        axios
            .get(`${CONFIG.REQUEST_BASE_URL}/minio/admin/resource/export`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const url = window.URL.createObjectURL(res.data); // blob
                const a = document.createElement('a');
                a.download = 'minio-files.zip';
                a.href = url;
                a.click();
                window.$message.success('一键导出资源成功');
            })
            .catch((err) => {
                window.$message.error('一键导出资源失败：', err);
            });
    };
    // 一键导入
    const resourceImport = async () => {
        await minioAxios.asyncBucket();
        await initDataSource();
    };

    // 自定义上传内容展示
    const customRender = (originNode: any, file: any) => {
        const { status } = file;
        let resDom: any = '';
        switch (status) {
            case 'uploading':
                resDom = (
                    <div className="file-item">
                        <div className="loading-box">
                            <Icon type="icon-loading" />
                        </div>
                    </div>
                );
                break;
            case 'done':
                resDom = (
                    <div className="file-item">
                        <div className="file-box item-box" title={file.name}>
                            <Icon type="icon-wenjian" />
                            <span>{file.name}</span>
                        </div>
                    </div>
                );
                break;
        }
        return resDom;
    };
    // 文件上传之前处理
    const beforeUpload = (file: any) => {
        const fileList = resourceList.filter((item: any) => !item.folderName);
        let isAllow = true;
        fileList.forEach((item: any) => {
            if (item.name === file.name) {
                window.$message.warn(`${file.name}已存在，请删除后重新上传`);
                isAllow = false;
            }
        });
        return isAllow;
    };

    const bucketName = lodash.get(pathList, '[1].name', '');
    const prefix = lodash.get(lodash.last(pathList), 'prefix');

    return (
        <div className="user-cloud">
            {/* 顶部路径展示 */}
            <div className={style['cloud-header']}>
                <div className={style['router-wrap']}>
                    {pathList.map((item, index) => {
                        const isLast = pathList.length === index + 1;
                        return (
                            <React.Fragment
                                key={`user-cloud-path-${item.name}`}
                            >
                                <span
                                    onClick={() => {
                                        !isLast && switchPath(item.name);
                                    }}
                                    className={
                                        isLast
                                            ? style['lastName']
                                            : style['name']
                                    }
                                >
                                    {item.name}
                                </span>
                                {!isLast && (
                                    <span className={style['split']}> › </span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
                <div className={style['btn-wrap']}>
                    <Button
                        style={{ marginRight: '1vw' }}
                        type="primary"
                        onClick={resourceExport}
                    >
                        一键导出
                    </Button>
                    <Upload
                        action="/minio/admin/resource/import"
                        uploadDone={resourceImport}
                        antdProps={{
                            accept:
                                'application/zip,application/x-zip,application/x-zip-compressed',
                        }}
                    >
                        <Button type="primary">一键导入</Button>
                    </Upload>
                    <Button
                        style={{ marginLeft: '1vw' }}
                        type="primary"
                        danger
                        onClick={asyncBucket}
                    >
                        数据同步
                    </Button>
                </div>
            </div>

            {/* 文件资源信息展示 */}
            <ContextMenuTrigger id="user-cloud-context-menu">
                <div className={style['cloud-content']}>
                    {/* 文件、文件夹 */}
                    <div className="resource-box">
                        {resourceList.map((item: any) => (
                            <ContextMenuTrigger
                                id={
                                    item.folderName
                                        ? 'user-cloud-folder-context-menu'
                                        : 'user-cloud-file-context-menu'
                                }
                                key={item.folderName || item.fileName}
                            >
                                <div
                                    className={
                                        item.folderName
                                            ? 'resource-wrap folder-wrap'
                                            : 'resource-wrap'
                                    }
                                    title={item.folderName || item.fileName}
                                    onMouseDown={(e) => {
                                        resourceOnClick(e, item);
                                    }}
                                >
                                    {item.folderName ? (
                                        <Icon type="icon-wenjianjia" />
                                    ) : (
                                        <Icon type="icon-wenjian" />
                                    )}
                                    <span>
                                        {item.folderName || item.fileName}
                                    </span>
                                </div>
                            </ContextMenuTrigger>
                        ))}
                    </div>

                    {/* 上传资源的按钮 */}
                    {pathList.length > 1 && (
                        <div
                            className={style['upload-btn']}
                            onClick={() => {
                                setUploadModalVisible(true);
                            }}
                        >
                            <Icon
                                type="icon-add1"
                                className={style['icon-add1']}
                            />
                        </div>
                    )}
                </div>
            </ContextMenuTrigger>

            {/* 文件夹：右键菜单 */}
            <ContextMenu id="user-cloud-folder-context-menu">
                <MenuItem onClick={folderLimitOnClick}>权限</MenuItem>
                <MenuItem onClick={folderDeleteOnClick}>删除</MenuItem>
            </ContextMenu>

            {/* 文件：右键菜单 */}
            <ContextMenu id="user-cloud-file-context-menu">
                <MenuItem onClick={fileCheckOnClick}>查看</MenuItem>
                <MenuItem onClick={fileDeleteOnClick}>删除</MenuItem>
            </ContextMenu>

            {/* 全局：右键菜单 */}
            <ContextMenu
                id="user-cloud-context-menu"
                hideOnLeave={true}
                style={{ width: '6vw' }}
            >
                <MenuItem onClick={newFolderOnClick}>
                    {pathList.length > 1 ? '新建目录' : '新建存储桶'}
                </MenuItem>
                <MenuItem disabled>待完善...</MenuItem>
                <MenuItem disabled>待完善...</MenuItem>
            </ContextMenu>

            {/* 资源上传的弹窗 */}
            <Modal
                title="资源上传"
                visible={uploadModalVisible}
                width="80%"
                onCancel={() => {
                    setUploadModalVisible(false);
                }}
                footer={null}
            >
                <Upload
                    action="/minio/admin/upload/multi"
                    multiple
                    uploadDone={initDataSource}
                    customRender={customRender}
                    beforeUpload={beforeUpload}
                    data={{
                        bucketName,
                        prefix,
                    }}
                >
                    <div className="upload-box">
                        <Icon type="icon-add2" />
                    </div>
                </Upload>
            </Modal>

            {/* 创建存储桶的弹窗 */}
            {bucketModalVisible && (
                <BucketModal
                    visible={bucketModalVisible}
                    setVisible={(visible) => {
                        setBucketModalVisible(visible);
                    }}
                    operation={bucketModalOperation}
                    handleOk={handleBucketOk}
                    defaultData={bucketModalDefaultData}
                />
            )}

            {/* 创建文件夹的弹窗 */}
            {folderModalVisible && (
                <FolderModal
                    visible={folderModalVisible}
                    setVisible={(visible) => {
                        setFolderModalVisible(visible);
                    }}
                    handleOk={handleFolderOk}
                />
            )}
        </div>
    );
};

export default UserCloud;
