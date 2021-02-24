import React from 'react';
import style from './style.module.scss';
import { Switch, Route, Redirect } from 'react-router-dom';
import AsyncComponents from '../asyncComponent';
import routerConfig from '../../utils/routersConfig';

const Routers: React.FC = () => {
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
