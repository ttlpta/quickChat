import React, { Component } from "react";

import axios from "../axios";
import SocialLogin from "./SocialLogin";

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
            <h3>Back to <span className="term"><a href="/login">Login</a></span></h3>
            <div className="submit">
              <input type="submit" value="Create account" />
            </div>
            <div className="clear"> </div>
        </form>
      </div>
    );
  }
}