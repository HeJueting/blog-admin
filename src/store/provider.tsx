import React, { useReducer } from 'react';
import reducer from './reducer';
import context from './context';

// 接口：props
interface IProviderProps {
    children: React.ReactNode;
}

const Provider: React.FC<IProviderProps> = ({ children }) => {
    // 使用reducer搭配context实现状态全局管理
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
    });
    window.$dispatch = dispatch;
    window.$store = state;

    return (
        <context.Provider value={{ state, dispatch }}>
            {children}
        </context.Provider>
    );
};

export default Provider;
