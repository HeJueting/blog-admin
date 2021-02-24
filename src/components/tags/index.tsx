import React, { useState, useRef } from 'react';
import style from './style.module.scss';
import lodash from '../../utils/lodash';
import { Tag, Input } from 'antd';
import Icon from '../icon';

// 接口：props
interface ITagesProps {
    title: string;
    tags: string[];
    setTags: (newTags: string[]) => void;
    className?: string;
}

const Tages: React.FC<ITagesProps> = ({ title, tags, setTags, className }) => {
    const inputRef = useRef<Input | null>(null);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');

    // 删除tag
    const deleteTag = (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        let newTags = lodash.cloneDeep(tags);
        newTags.splice(newTags.indexOf(tag), 1);
        newTags = lodash.uniq(newTags);
        setTags(newTags);
    };

    // 点击新tag
    const newTag = () => {
        setVisible(true);
        process.nextTick(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        });
    };

    // 失去焦点
    const inputOnBlur = () => {
        if (value) {
            let newTags = lodash.cloneDeep(tags);
            newTags.push(value);
            newTags = lodash.uniq(newTags);
            setTags(newTags);
        }
        setValue('');
        setVisible(false);
    };

    return (
        <div className={`${style['tags']} title-form-wrap ${className}`}>
            <h6>{title}</h6>
            <div className="tags-wrap">
                {tags.map((item) => (
                    <Tag
                        className={style['ant-tag']}
                        key={`hobbyTags-${item}`}
                        closable
                        onClose={(e) => {
                            deleteTag(e, item);
                        }}
                    >
                        {item}
                    </Tag>
                ))}
            </div>
            {!visible && (
                <Icon
                    className={style['icon-add']}
                    type="icon-add"
                    onClick={newTag}
                />
            )}
            {visible && (
                <Input
                    ref={inputRef}
                    value={value}
                    style={{ width: '6vw' }}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    onBlur={inputOnBlur}
                />
            )}
        </div>
    );
};

export default Tages;
