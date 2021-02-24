import React, { useState, useImperativeHandle } from 'react';
import style from './style.module.scss';
import './braft-editor.css';
import './code-highlighter.css';
import CONFIG from '../../config';
import localForage from 'localforage';
import { EditorColors } from '../../assets/styles/theme';
// editor编辑器扩展
import BraftEditor from 'braft-editor';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import HeaderId from 'braft-extensions/dist/header-id';
// prismjs代码包
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-json.js';

// 编写关键字扩展模块
const keyWordExtension = {
    // 指定扩展类型
    type: 'entity',
    // 指定扩展样式名，推荐使用全大写
    name: 'KEYWORD',
    // 在编辑器工具栏中增加一个样式控制按钮，text可以为一个react组件
    control: {
        text: '关键字',
    },
    // 指定entity在编辑器中的渲染组件
    component: (param: any) => (
        <span className="braft-custom-keywords">{param.children}</span>
    ),
    // 指定html转换为editorState时，何种规则的内容将会转换成该entity
    importer: (nodeName: any, node: any) =>
        nodeName.toLowerCase() === 'span' &&
        node.classList &&
        node.classList.contains('braft-custom-keywords'),
    // 定输出该模块在输出的html中的呈现方式
    exporter: () => <span className="braft-custom-keywords" />,
};
// 加载关键字扩展模块
BraftEditor.use(keyWordExtension);

// 编辑器代码高亮
BraftEditor.use(
    CodeHighlighter({
        syntaxs: [
            {
                name: 'JavaScript',
                syntax: 'javascript',
            },
            {
                name: 'React/Vue',
                syntax: 'jsx',
            },
            {
                name: 'HTML',
                syntax: 'html',
            },
            {
                name: 'CSS',
                syntax: 'css',
            },
            {
                name: 'Less',
                syntax: 'less',
            },
            {
                name: 'JSON',
                syntax: 'json',
            },
        ],
    })
);

// 为标题增加锚点功能
BraftEditor.use(HeaderId());

// 接口：props
interface IEditorProps {
    html: string;
    setHtml: (html: string) => void;
    controls?: any[];
}

const Editor = ({ html, setHtml, controls }: IEditorProps, ref: any) => {
    const [editorState, setEditorState] = useState(
        BraftEditor.createEditorState(html)
    );

    // 初始化editorRef，将initEditorState、getTextContent方法暴露出去
    useImperativeHandle(ref, () => ({
        initEditorState: (html: string) => {
            setEditorState(BraftEditor.createEditorState(html));
        },
        getTextContent: (length: number) => {
            return editorState.toText().slice(0, length).replace(/\r|\n/g, '');
        },
    }));

    // 编辑器内容发生改变
    const handleChange = (editorState: any) => {
        setEditorState(editorState);
        setHtml(editorState.toHTML());
    };

    // px转rem
    const getHtmlFontSize = () => {
        const sizeBase = document.documentElement.style.fontSize.replace(
            /[a-z]/g,
            ''
        );
        return Number(sizeBase);
    };
    const unitImportFn = (unit: string) => {
        const sizeBase = getHtmlFontSize();
        // 此函数的返回结果，需要过滤掉单位，只返回数值
        if (unit.indexOf('rem')) {
            return parseFloat(unit) * sizeBase;
        }
        return parseFloat(unit);
    };
    const unitExportFn = (unit: number, type: string, target: string) => {
        const sizeBase = getHtmlFontSize();
        // 输出行高时不添加单位
        if (type === 'line-height') {
            return unit;
        }
        // target的值可能是html或者editor，对应输出到html和在编辑器中显示这两个场景
        if (target === 'html') {
            // 只在将内容输出为html时才进行转换
            return `${unit / sizeBase}rem`;
        }
        // 在编辑器中显示时，按px单位展示
        return `${unit}px`;
    };

    // 多媒体上传
    const editorUploadFn = async (param: any) => {
        const token = await localForage.getItem('token');
        const serverURL = `${CONFIG.REQUEST_BASE_URL}/minio/admin/upload/single`;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        const successFn = (response: any) => {
            // 上传成功后调用param.success并传入上传后的文件地址
            const res = JSON.parse(response.target.response);
            // 上传结果响应
            if (res.code === 0) {
                param.success({
                    url: `${CONFIG.REQUEST_BASE_URL}/minio/frontend/access/file/temporary/${param.file.name}`,
                    meta: {
                        loop: true,
                        autoPlay: true,
                        controls: true,
                    },
                });
            } else {
                window.$message.error(res.msg);
                param.error({
                    msg: res.msg,
                });
            }
        };

        const progressFn = (event: any) => {
            // 上传进度发生变化时调用param.progress
            param.progress((event.loaded / event.total) * 100);
        };

        const errorFn = () => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.',
            });
        };

        xhr.upload.addEventListener('progress', progressFn, false);
        xhr.addEventListener('load', successFn, false);
        xhr.addEventListener('error', errorFn, false);
        xhr.addEventListener('abort', errorFn, false);

        fd.append('bucketName', 'temporary');
        fd.append('prefix', '');
        fd.append('filename', param.file.name);
        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(fd);
    };

    // 默认控件
    const defaultControls = [
        'headings',
        'font-size',
        'line-height',
        'letter-spacing',
        'separator',
        'emoji',
        'media',
        'text-color',
        'bold',
        'italic',
        'link',
        'hr',
        'separator',
        'underline',
        'strike-through',
        'superscript',
        'subscript',
        'remove-styles',
        'separator',
        'text-align',
        'separator',
        'list-ul',
        'list-ol',
        'blockquote',
        'code',
        'separator',
        'clear',
    ];

    return (
        <div className={style['editor']}>
            <BraftEditor
                colors={EditorColors}
                controls={controls || defaultControls}
                value={editorState}
                converts={{
                    unitImportFn,
                    unitExportFn,
                }}
                onChange={handleChange}
                media={{
                    uploadFn: editorUploadFn,
                }}
            />
        </div>
    );
};

export default React.forwardRef(Editor);
