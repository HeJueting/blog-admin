import React, { useState, useEffect } from 'react';
import style from '../style.module.scss';
import lodash from '../../../utils/lodash';
import Icon from '../../../components/icon';
import { Modal, Input, Button } from 'antd';
import settingAxios from '../../../api/setting';

// 接口：props
interface ILinksProps {
    data: {
        _id: string;
        links: {
            title: string;
            url: string;
        }[];
    };
}

const Links: React.FC<ILinksProps> = ({ data }) => {
    // 友情链接管理
    const [links, setLinks] = useState<any>([]);
    // 弹窗
    const [visible, setVsible] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        data && setLinks(data.links);
    }, [data]);

    // 保存
    const save = async () => {
        const res = await settingAxios.update({
            _id: data._id,
            data: {
                links,
            },
        });
        if (res.code === 0) {
            window.$message.success('保存成功');
        }
    };

    // 点击删除友情链接
    const deleteLinks = (index: number) => {
        links.splice(index, 1);
        setLinks(lodash.cloneDeep(links));
    };

    // 确认添加友情链接
    const onOk = () => {
        if (!title) {
            window.$message.error('请输入网页标题');
        } else if (!url) {
            window.$message.error('请输入链接地址');
        } else if (links.filter((item: any) => item.title == title).length) {
            window.$message.error('已存在该网页链接');
        } else {
            links.push({
                title,
                url,
            });
            setLinks(lodash.cloneDeep(links));
            onCancel();
        }
    };
    // 取消
    const onCancel = () => {
        setVsible(false);
        setTitle('');
        setUrl('');
    };

    return (
        <div className={style['wrap']}>
            <div className={style['title-module']}>
                <h3>友情链接</h3>
                <Button onClick={save} type="primary">
                    保 存
                </Button>
            </div>
            <div className={style['link-wrap']}>
                {/* 友情链接 */}
                {links.map((item: any, index: number) => (
                    <div className={style['link-item']} key={item.title}>
                        <a href={item.url} target="_blank">
                            {item.title}
                        </a>
                        <Icon
                            onClick={() => {
                                deleteLinks(index);
                            }}
                            type="icon-error"
                            className={style['icon-error']}
                        />
                    </div>
                ))}
                {/* 添加友情链接的icon */}
                <div
                    className={style['add-wrap']}
                    onClick={() => {
                        setVsible(true);
                    }}
                >
                    <Icon type="icon-add2" className={style['icon-add2']} />
                </div>
            </div>
            <Modal
                title="添加友情链接"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <Input
                    style={{ marginBottom: '1vw' }}
                    placeholder="请输入网页标题"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                ></Input>
                <Input
                    placeholder="请输入链接地址"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                    }}
                ></Input>
            </Modal>
        </div>
    );
};

export default Links;
