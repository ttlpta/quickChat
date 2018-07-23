import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from '../PrivateRoute';
import ContentNull from "./ContentNull";
import Content from "./Content";

export default class ContentRouter extends Component
{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  
  render() {
    return (
      <Switch>
        <Route exact path='/chat/:partnerid' render={ props => (<Content { ...props } currentUser={ this.props.currentUser }/>) } />
        <Route component={ContentNull} />
      </Switch>
    );
  }
}