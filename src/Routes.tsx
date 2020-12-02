import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { BaseGuardProps, GuardedRoute, GuardProvider } from 'react-router-guards';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Loading } from './Components/Loading/Loading';
import { Protected } from './pages/Protected';
import { Public } from './pages/Public';
import { checkAuth } from './RouteAuth';
import { Search } from './Components/Search/Search';


const NotFound: React.FC<BaseGuardProps> = ({ error }) => (
  <div>
    <h1>Not found.</h1>
    <p>{error}</p>
  </div>
);


const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <GuardProvider loading={Loading} error={NotFound}>
          <Switch>
            <GuardedRoute path="/login" exact component={Login} />
            <GuardedRoute path="/a" exact component={Protected} meta={{ auth: true }} guards={[checkAuth]} />
            <GuardedRoute path="/v" exact component={Public} />
            <GuardedRoute path="/" exact component={Home} />
            <GuardedRoute path="/search" exact component={Search} />
            <GuardedRoute path="*" component={NotFound} />
          </Switch>
        </GuardProvider>
      </div>
    </BrowserRouter >
  )
}

export default Routes;
