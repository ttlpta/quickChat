import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

import axios from "../axios";
import SocialLogin from "./SocialLogin";
import * as jquery from '../jquery';

export default class Signup extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      errMsg : ''
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ errMsg : '' });
    try {
      const response = await axios.post('/user/regist', this.state);
      if(response.data.success) {
        this.setState({});
        jquery.alert('Signup success');
        localStorage.setItem('quickchat', JSON.stringify(response.data.data));
        this.props.history.push('/')
      } else {
        jquery.alert('Signup fail', 'warn');
      }
    } catch ({ response }) {
      this.setState({ errMsg : response.data.message });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  render() {
    return (
      <div className="main">
        <SocialLogin />
        <h2>Or Signup with</h2>
        {
          this.state.errMsg && 
          <span className="errorMsg">{ this.state.errMsg }</span>
        }
        <form onSubmit={ this.onSubmit }>
            <div className="lable">
              <div className="col_1_of_2 span_1_of_2">
                <input 
                  type="text" 
                  className="text" 
                  onChange={ this.onChange }
                  placeholder="First Name" 
                  name="firstname"/>
              </div>
              <div className="col_1_of_2 span_1_of_2">
                <input 
                  type="text" 
                  className="text" 
                  onChange={ this.onChange }
                  placeholder="Last Name" 
                  name="lastname" />
              </div>
              <div className="clear"> </div>
            </div>
            <div className="lable-2">
              <input type="text" className="text" placeholder="your@email.com" name="email" onChange={ this.onChange }/>
              <input type="password" className="text" placeholder="Password" name="password" onChange={ this.onChange } />
            </div>
            <h3>Back to <span className="term"><Link to="/login">Login</Link></span></h3>
            <div className="submit">
              <input type="submit" value="Create account" />
            </div>
            <div className="clear"> </div>
        </form>
      </div>
    );
  }
}