import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import AsyncComponents from '../asyncComponent';
import routerConfig from '../../utils/routersConfig';
import { showLoading } from '../../utils/help';

interface IRourerProps {}

const Routers: React.FC<IRourerProps> = () => {
    // location
    let location = useLocation();
    // state
    const [hisPath, setHisPath] = useState<string>('');

    // 切换路由时，不用自动loading的路由
    const whiteRouters = ['/user/flow', '/user/active', '/record/edit'];

    useEffect(() => {
        console.log(location.pathname);
        if (hisPath !== location.pathname) {
            if (whiteRouters.indexOf(location.pathname) === -1) {
                showLoading();
            }
            setHisPath(location.pathname);
        }
    }, [location]);

    return (
        <main className={style.main}>
            <Switch>
                {routerConfig.map((item) => {
                    return (
                        <Route
                            key={`router-${item.folderName}`}
                            path={item.path}
                            component={AsyncComponents(
                                React.lazy(
                                    () =>
                                        import(`../../pages/${item.folderName}`)
                                )
                            )}
                        />
                    );
                })}
                <Redirect to="/user/flow" />
            </Switch>
        </main>
    );
};

export default Routers;
