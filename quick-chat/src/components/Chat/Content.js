import React, { Component } from "react";

import { authAxios } from "../../axios";
import { NO_IMAGE } from '../../contanst';
import { alert } from '../../utils'
import { throws } from "assert";

export default class Content extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      partner : {}
    }
  }

  getProfilePartner = async (partnerId) => {
    try {
      const { data } = await authAxios().get(`/auth/user/detail?user_id=${partnerId}`);
      if(data.success) {
        this.setState({
          partner : {
            id : data.data._id,
            email : data.data.email,
            firstname : data.data.firstname,
            lastname : data.data.lastname,
            avatar : data.data.avatar || NO_IMAGE,
            is_partner : false
          }
        });
      }
    } catch (error) {
      if(error.response.status == 422) {
        alert('Not found partner', 'error');
      } else {
        alert('Error', 'error');
        this.props.history.push('/');
      }
    }
  }

  addFriend = async () => {
    try {
      const response = await authAxios().post(`/auth/user/contacts`, { partner_id : this.state.partner.id });
      if(response.data.success) {
        this.setState({ partner : { ...this.state.partner, is_partner : true } });
      }
    } catch (error) {
      if(error.response.status == 409) {
        alert('You have already add this person', 'warning');
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.match.params.partnerid == nextProps.currentUser.id) {
      return false;
    } 

    return true;
  }

  componentDidMount(){
    const partnerId = this.props.match.params.partnerid;
    this.getProfilePartner(partnerId);
      // if(this.props.currentUser.id == partnerId) {
      //   // this.props.history.push('/');
      // }
  }

  render(){
    return (
      <div className="content">
        <div className="contact-profile">
          <img src={ this.state.partner.avatar } alt="Your partner Avatar" />
          <p>{`${this.state.partner.firstname} ${this.state.partner.lastname}`}</p>
          <div className="social-media">
            <i className={`fa ${ this.state.partner.is_partner ? 'fa-user-times' : 'fa-user-plus'}`} aria-hidden="true" onClick={ this.addFriend }></i> {/* fa fa-user-times */}
            <i className="fa fa-heart-o" aria-hidden="true"></i> {/* fa-heart */}
            <i className="fa fa-hand-pointer-o" aria-hidden="true"></i> 
            <i className="fa fa-video-camera" aria-hidden="true"></i>
            <i className="fa fa-heartbeat" aria-hidden="true"></i>
            <i className="fa fa-bell-slash" aria-hidden="true"></i>{/* fa fa fa-bell */}
          </div>
        </div>
        <div className="messages">
          <ul>
            <li className="sent">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
            </li>
            <li className="replies">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>When you're backed against the wall, break the god damn thing down.</p>
            </li>
            <li className="replies">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>Excuses don't win championships.</p>
            </li>
            <li className="sent">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" />
              <p>Oh yeah, did Michael Jordan tell you that?</p>
            </li>
            <li className="replies">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>No, I told him that.</p>
            </li>
            <li className="replies">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>What are your choices when someone puts a gun to your head?</p>
            </li>
            <li className="sent">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" />
              <p>What are you talking about? You do what they say or they shoot you.</p>
            </li>
            <li className="replies">
              <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
              <p>Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
            </li>
          </ul>
        </div>
        <div className="message-input">
          <div className="wrap">
          <input type="text" placeholder="Write your message..." />
          <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
          <button className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    )
  }
}