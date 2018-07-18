import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import axios from "../axios";
import SocialLogin from "./SocialLogin";
import { checkIsLogging } from '../utils';

export default class Login extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      errMsg : ''
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ errMsg : '' });
    try {
      const response = await axios.post('/user/login', this.state);
    } catch ({ response }) {
      this.setState({ errMsg : response.data.message });
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    if(checkIsLogging())
      return <Redirect to={from} />;

    return (
      <div className="main">
        <SocialLogin />
        <h2>Or Login with</h2>
        {
          this.state.errMsg && 
          <span className="errorMsg">{ this.state.errMsg }</span>
        }
        <form onSubmit={ this.onSubmit }>
          <div className="lable-2">
            <input 
              type="text" 
              name="email"
              className="text" 
              placeholder="your@email.com" 
              onChange={ this.onChange }
            />
            <input 
              type="password" 
              name="password"
              className="text" 
              placeholder="Password" 
              onChange={ this.onChange }
            />
          </div>
          <h3>You don't have account? <span className="term"><Link to="/signup">Signup</Link></span></h3>
          <div className="submit">
            <input type="submit" value="Login" />
          </div>
          <div className="clear"> </div>
        </form>
      </div>
    );
  }
}