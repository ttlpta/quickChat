import React, { Component } from "react";

import axios from "../axios";
import { alert } from '../jquery';
import { NO_IMAGE } from '../contanst';
export default class Chat extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      user : {}
    };
    this.canUpdateProfile = false;
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

    $("#status-options ul li").click(function() {
      $("#profile-img").removeClass();
      $("#status-online").removeClass("active");
      $("#status-away").removeClass("active");
      $("#status-busy").removeClass("active");
      $("#status-offline").removeClass("active");
      $(this).addClass("active");
      
      if($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
      } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
      } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
      } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
      } else {
        $("#profile-img").removeClass();
      };
      
      $("#status-options").removeClass("active");
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

  getProfileUser = async () => {
    try {
      const { data } = await axios.get('/auth/user/detail');
      if(data.success) {
        this.setState({
          user : {
            email : data.data.email,
            firstname : data.data.firstname,
            lastname : data.data.lastname,
            avatar : data.data.avatar || NO_IMAGE
          }
        });
      }
    } catch ({ response }) {
      if(response.status == 400) {
        alert('Token expired', 'warn');
      }
    }
  }

  updateProfile = ({ target }) => {
    if(this.canUpdateProfile) {
      setTimeout(async () => {
        const user = this.state.user;
        try {
          const { data } = await axios.put('/auth/user/detail', user);
          if(data.success) {
            alert('Updated success');
            this.setState({
              user : {
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

  componentDidMount(){
    this.jqueryInit();
    this.getProfileUser();
  }

  render() {
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
                  <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                  <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                  <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                  <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                </ul>
              </div>
              <div id="expanded">
                <label htmlFor="email"><i className="fa fa-google fa-fw" aria-hidden="true"></i></label>
                <input disabled name="email" type="text" value={ this.state.user.email } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <label htmlFor="firstname"><i className="fa fa-user fa-fw" aria-hidden="true"></i></label>
                <input name="firstname" type="text" value={ this.state.user.firstname } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <label htmlFor="lastname"><i className="fa fa-user fa-fw" aria-hidden="true"></i></label>
                <input name="lastname" type="text" value={ this.state.user.lastname } onChange={ this.onChangeText } onBlur={ this.updateProfile }/>
                <label htmlFor="avatar"><i className="fa fa-camera fa-fw" aria-hidden="true"></i></label>
                <input name="avatar" type="button" value="Change Avatar"/>
              </div>
            </div>
          </div>
          <div id="search">
            <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
            <input type="text" placeholder="Search contacts..." />
          </div>
          <div id="contacts">
            <ul>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status online"></span>
                  <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
                  <div className="meta">
                    <p className="name">Louis Litt</p>
                    <p className="preview">You just got LITT up, Mike.</p>
                  </div>
                </div>
              </li>
              <li className="contact active">
                <div className="wrap">
                  <span className="contact-status busy"></span>
                  <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                  <div className="meta">
                    <p className="name">Harvey Specter</p>
                    <p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status away"></span>
                  <img src="http://emilcarlsson.se/assets/rachelzane.png" alt="" />
                  <div className="meta">
                    <p className="name">Rachel Zane</p>
                    <p className="preview">I was thinking that we could have chicken tonight, sounds good?</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status online"></span>
                  <img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="" />
                  <div className="meta">
                    <p className="name">Donna Paulsen</p>
                    <p className="preview">Mike, I know everything! I'm Donna..</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status busy"></span>
                  <img src="http://emilcarlsson.se/assets/jessicapearson.png" alt="" />
                  <div className="meta">
                    <p className="name">Jessica Pearson</p>
                    <p className="preview">Have you finished the draft on the Hinsenburg deal?</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status"></span>
                  <img src="http://emilcarlsson.se/assets/haroldgunderson.png" alt="" />
                  <div className="meta">
                    <p className="name">Harold Gunderson</p>
                    <p className="preview">Thanks Mike! :)</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status"></span>
                  <img src="http://emilcarlsson.se/assets/danielhardman.png" alt="" />
                  <div className="meta">
                    <p className="name">Daniel Hardman</p>
                    <p className="preview">We'll meet again, Mike. Tell Jessica I said 'Hi'.</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status busy"></span>
                  <img src="http://emilcarlsson.se/assets/katrinabennett.png" alt="" />
                  <div className="meta">
                    <p className="name">Katrina Bennett</p>
                    <p className="preview">I've sent you the files for the Garrett trial.</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status"></span>
                  <img src="http://emilcarlsson.se/assets/charlesforstman.png" alt="" />
                  <div className="meta">
                    <p className="name">Charles Forstman</p>
                    <p className="preview">Mike, this isn't over.</p>
                  </div>
                </div>
              </li>
              <li className="contact">
                <div className="wrap">
                  <span className="contact-status"></span>
                  <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="" />
                  <div className="meta">
                    <p className="name">Jonathan Sidwell</p>
                    <p className="preview"><span>You:</span> That's bullshit. This deal is solid.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div id="bottom-bar">
            <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
            <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
          </div>
        </div>
        <div className="content">
          <div className="contact-profile">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
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
                <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
              </li>
              <li className="replies">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p>When you're backed against the wall, break the god damn thing down.</p>
              </li>
              <li className="replies">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p>Excuses don't win championships.</p>
              </li>
              <li className="sent">
                <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                <p>Oh yeah, did Michael Jordan tell you that?</p>
              </li>
              <li className="replies">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p>No, I told him that.</p>
              </li>
              <li className="replies">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                <p>What are your choices when someone puts a gun to your head?</p>
              </li>
              <li className="sent">
                <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                <p>What are you talking about? You do what they say or they shoot you.</p>
              </li>
              <li className="replies">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
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
      </div>
    );
  }
}