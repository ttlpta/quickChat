import React, { Component } from "react";
import { authAxios } from "../../axios";

export default class Contacts extends Component
{
  constructor(props) {
    super(props);
  }

  getListContact = async () => {
    // const contacts = await authAxios().get('/auth/user/listContactslistContacts');
    // console.log(contacts); 
  } 

  componentDidMount(){
    this.getListContact();
  }

  render(){
    return (
      <div>
        <div id="search">
          <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
          <input type="text" placeholder="Search contacts..." />
        </div>
        <div id="contacts">
          <ul>
            <li className="contact active">
              <div className="wrap">
                <span className="contact-status online"></span>
                <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
                <div className="meta">
                  <p className="name">Louis Litt</p>
                  <p className="preview">You just got LITT up, Mike.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
} 