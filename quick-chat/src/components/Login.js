import React, { Component } from "react";

export default class Login extends Component
{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="main">
        <div class="social-icons">
            <div class="col_1_of_f span_1_of_f">
              <a href="#">
                  <ul class='facebook'>
                    <i class="fb"> </i>
                    <li>Connect with Facebook</li>
                    <div class='clear'> </div>
                  </ul>
              </a>
            </div>
            <div class="col_1_of_f span_1_of_f">
              <a href="#">
                  <ul class='twitter'>
                    <i class="tw"> </i>
                    <li>Connect with Twitter</li>
                    <div class='clear'> </div>
                  </ul>
              </a>
            </div>
            <div class="clear"> </div>
        </div>
        <h2>Or Signup with</h2>
        <form>
            <div class="lable">
              <div class="col_1_of_2 span_1_of_2">	<input type="text" class="text" value="First Name" id="active" /></div>
              <div class="col_1_of_2 span_1_of_2"><input type="text" class="text" value="Last Name" /></div>
              <div class="clear"> </div>
            </div>
            <div class="lable-2">
              <input type="text" class="text" value="your@email.com " />
              <input type="password" class="text" value="Password " />
            </div>
            <h3>By creating an account, you agree to our <span class="term"><a href="#">Terms & Conditions</a></span></h3>
            <div class="submit">
              <input type="submit" value="Create account" />
            </div>
            <div class="clear"> </div>
        </form>
      </div>
    );
  }
}