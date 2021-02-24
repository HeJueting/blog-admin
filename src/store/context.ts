import React from 'react';

// 接口：context
interface IContext {
    state: any;
    dispatch: React.Dispatch<any>;
}

// 创建Context
const context = React.createContext<IContext>({} as IContext);

export default context;
