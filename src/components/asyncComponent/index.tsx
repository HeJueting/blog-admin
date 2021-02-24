import React from 'react';

// 接口：AsyncComponent方法
interface IAsyncComponent {
    (Component: React.FC): any;
}

const AsyncComponent: IAsyncComponent = (Component) => {
    return function () {
        return (
            <React.Suspense fallback={null}>
                <Component />
            </React.Suspense>
        );
    };
};

export default AsyncComponent;
