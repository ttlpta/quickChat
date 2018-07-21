import React, { Component } from "react";
import _ from 'lodash';

import { authAxios } from "../../axios";
import { alert } from '../../jquery';
import { uploadImage } from '../../utils';
import { NO_IMAGE, OFFLINE, ONLINE, BUSY, FORCE_OFFLINE } from '../../contanst';
import socket from '../../socket';
import Contacts from "./Contacts";
import ModalAddContacts from "./ModalAddContacts";

export default class Chat extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      user : {}
    };
    this.canUpdateProfile = false;
    this.uploadAvatarInput = React.createRef();
    
  }

  jqueryInit() {
    const $ = window.$;
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    $("#profile-img").click(function() {
      $("#status-options").toggleClass("active");
    });

    $(".expand-button").click(function() {
      $("#profile").toggleClass("expanded");
      $("#contacts").toggleClass("expanded");
    });

    function newMessage() {
      const message = $(".message-input input").val();
      if($.trim(message) == '') {
        return false;
      }
      $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
      $('.message-input input').val(null);
      $('.contact.active .preview').html('<span>You: </span>' + message);
      $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    };

    $('.submit').click(function() {
      newMessage();
    });

    $(window).on('keydown', function(e) {
      if (e.which == 13) {
        newMessage();
        return false;
      }
    });
  }

  changeStatusBorder() {
    const $ = window.$;
    $("#profile-img").removeClass();
    if(this.state.user.status == ONLINE) {
      $("#profile-img").addClass("online");
    } else if(this.state.user.status == OFFLINE || this.state.user.status == FORCE_OFFLINE) {
      $("#profile-img").addClass("offline");
    } else if(this.state.user.status == BUSY) {
      $("#profile-img").addClass("busy");
    } else {
      $("#profile-img").removeClass();
    }
  }

  getProfileUser = async () => {
    try {
      const { data } = await authAxios().get('/auth/user/detail');
      if(data.success) {
        this.setState({
          user : {
            id : data.data._id,
            email : data.data.email,
            firstname : data.data.firstname,
            lastname : data.data.lastname,
            avatar : data.data.avatar || NO_IMAGE,
            status : data.data.status ? data.data.status : ONLINE
          }
        });
      }
    } catch (err) {
      if(!_.isUndefined(err.response)) {
        if(err.response.status == 422 || err.response.status == 403) {
          localStorage.removeItem('quickchat');
          window.location.reload() 
        } 
      }
      alert('Error', 'warn');
    }
  }

  updateProfile = ({ target }) => {
    if(this.canUpdateProfile) {
      setTimeout(async () => {
        const user = this.state.user;
        try {
          const { data } = await authAxios().put('/auth/user/detail', user);
          if(data.success) {
            alert('Updated success');
            this.setState({
              user : {
                ...this.state.user,
                email : data.data.email,
                firstname : data.data.firstname,
                lastname : data.data.lastname,
                avatar : data.data.avatar || NO_IMAGE
              }
            });
          } else {
            alert('Updated fail', 'warn');
          }
        } catch ({ response }) {
          alert(response.message, 'warn');
        }
      }, 500);
      this.canUpdateProfile = false;
    }
  }

  onChangeText = e => {
    if(e.target.value != this.state.user[e.target.name]) {
      this.setState({ user : { ...this.state.user, [e.target.name] : e.target.value } });
      this.canUpdateProfile = true;
    }
  }

  uploadFile = () => {
    this.uploadAvatarInput.current.click();
  }

  readUrl = async e => {
    const input = e.target;
    if (input.files && input.files[0]) {
      try {
        let imgFormData = new FormData();
        imgFormData.append('avatar', input.files[0], 'profile.jpg');
        const imageUrl = await uploadImage(imgFormData);
        if(imageUrl) {
          const { data } = await authAxios().put('/auth/user/detail', { avatar : imageUrl });
          if(data.success) {
            alert('Upload avatar success');
            setTimeout(() => {
              this.setState({
                user : {
                  ...this.state.user,
                  avatar : data.data.avatar || NO_IMAGE
                }
              });
            }, 500);
          } else {
            alert('Upload avatar fail', 'warn');
          }
        }
      } catch ({ response }) {
        alert(response.statusText, 'warn');
      }
    }
  }

  onChangeStatus = async status => {
    if(this.state.user.status != status) {
      try {
        const response = await authAxios().put('/auth/user/updateStatus', { status });
        if(response.data.success) {
          // this.setState({ user : { ...this.state.user, status : status }});
          const wsData = {
            user_id : this.state.user.id,
            status
          };
          socket.emit('update_status_user', wsData);
        }
  
      } catch (error) {
        console.log('===>' , error);
      }
    }
  }

  getStatusString = status => {
    let statusStr;
    switch (status) {
      case 0:
        statusStr = 'offline'
        break;
      case 4:
        statusStr = 'offline'
        break;
      case 1:
        statusStr = 'online'
        break;
      case 2:
        statusStr = 'busy'
        break;
    }
    
    return statusStr;
  }

  componentDidMount(){
    this.jqueryInit();
    this.getProfileUser();
    socket.on('update_status_user', data => {
      if(this.state.user.id == data.user_id) {
        this.setState({ user : { ...this.state.user , status : data.status } });
      }
    });
  }

  componentDidUpdate(preProps, preState) {
    if(preState.user.status != this.state.user.status) {
      this.changeStatusBorder();
    }
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    const statusListLabel = {
      'offline' : 'Offline',
      'online' : 'Online',
      'busy' : 'Busy',
    };

    const statusListValue = {
      'offline' : FORCE_OFFLINE,
      'online' : ONLINE,
      'busy' : BUSY,
    };

    return (
      <div id="frame">
        <div id="sidepanel">
          <div id="profile">
            <div className="wrap">
              <img id="profile-img" src={ this.state.user.avatar } className="online" />
              <p>{ this.state.user.firstname } { this.state.user.lastname }</p>
              <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
              <div id="status-options">
                <ul>
                  {
                    Object.keys(statusListLabel).map((label, index) => {
                      return (
                        <li key={`item-${index}`} id={`status-${label}`} className={ statusListValue[label] == this.state.user.status ? 'active' : ''} onClick={ () => this.onChangeStatus(statusListValue[label]) }>
                          <span className="status-circle"></span> <p>{statusListLabel[label]}</p>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
              <div id="expanded">
                <label htmlFor="email"><i className="fa fa-google fa-fw" aria-hidden="true"></i></label>
                <input disabled name="email" type="text" defaultValue={ this.state.user.email } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <label htmlFor="firstname"><i className="fa fa-user fa-fw" aria-hidden="true"></i></label>
                <input name="firstname" type="text" defaultValue={ this.state.user.firstname } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <label htmlFor="lastname"><i className="fa fa-user fa-fw" aria-hidden="true"></i></label>
                <input name="lastname" type="text" defaultValue={ this.state.user.lastname } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <input type="file" onChange={ this.readUrl } name="avatarUploaed" ref={ this.uploadAvatarInput } style={{ display : 'none' }}/>
                <button onClick={ this.uploadFile }><i className="fa fa-camera fa-fw" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <Contacts />
          <div id="bottom-bar">
            <button id="addcontact" data-toggle="modal" data-target="#myModal"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
            <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
          </div>
        </div>
        <div className="content">
          <div className="contact-profile">
            <img src="http://localhost:3001/avatar/avatar_5b51f5f87921eb0042cffff5_1532098057535.jpg" alt="" />
            <p>Harvey Specter</p>
            <div className="social-media">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <i className="fa fa-twitter" aria-hidden="true"></i>
              <i className="fa fa-instagram" aria-hidden="true"></i>
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
        <ModalAddContacts />
      </div>
    );
  }
}