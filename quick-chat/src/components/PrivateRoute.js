import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { checkIsLogging } from '../utils';  


const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggin = checkIsLogging();
  return (<Route { ...rest } render={ props => (
    isLoggin ? (
      <Component { ...props }/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>)
}

export default PrivateRoute;