import React, { Component } from "react";

export default class SocialLogin extends Component
{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="social-icons">
          <div className="col_1_of_f span_1_of_f">
            <a href="#">
                <ul className='facebook'>
                  <i className="fb"> </i>
                  <li>Connect with Facebook</li>
                  <div className='clear'> </div>
                </ul>
            </a>
          </div>
          <div className="col_1_of_f span_1_of_f">
            <a href="#">
                <ul className='twitter'>
                  <i className="tw"> </i>
                  <li>Connect with Twitter</li>
                  <div className='clear'> </div>
                </ul>
            </a>
          </div>
          <div className="clear"> </div>
      </div>
    );
  }
}