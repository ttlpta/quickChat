import React, { Component } from "react";
import { authAxios } from "../../axios";
import { NO_IMAGE, OFFLINE, ONLINE, BUSY, FORCE_OFFLINE } from '../../contanst';

const $ = window.$;
export default class Contacts extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      contacts : []
    };
    this.timeoutSearch = null;
    this.initListContact = [];
  }

  getListContact = async () => {
    const result = await authAxios().get('/auth/user/listContacts');
    if(result.data.success && result.data.data) {
      this.initListContact = result.data.data;
      this.setState({ contacts : result.data.data });
    }
  } 

  onSearch = e => {
    const searchTxt = e.target.value;
    if(!searchTxt) {
      this.setState({ contacts : this.initListContact });
    }
    if(this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }

    this.timeoutSearch = setTimeout( async () => {
      try {
        const { data } = await authAxios().get(`/auth/user/search?q=${searchTxt}`);
        if(data.success) {
          this.setState({ contacts : data.data });
        } 
      } catch (error) {
        console.log(error.response.data);
      }
      
    }, 500);
  }

  componentDidMount(){
    this.getListContact();
    this.props.socket.on('update_status_user', data => {
      const statusListClass = {
        [FORCE_OFFLINE] : 'offline',
        [ONLINE] : 'online',
        [OFFLINE] : 'online',
        [BUSY] : 'busy',
      };

      $(`#${data.user_id}`).removeClass().addClass(`contact-status ${statusListClass[data.status]}`);
    });
  }

  render(){

    const statusListClass = {
      [FORCE_OFFLINE] : 'offline',
      [ONLINE] : 'online',
      [OFFLINE] : 'online',
      [BUSY] : 'busy',
    };

    return (
      <div>
        <div id="search">
          <label htmlFor="search"><i className="fa fa-search" aria-hidden="true"></i></label>
          <input type="text" name="search" placeholder="Search contacts..." onChange={ this.onSearch } />
        </div>
        <div id="contacts">
          <ul>
            {
              this.state.contacts.map((item, idx) => {
                return (
                  <li key={`contactItem-${item._id}`} className="contact active">
                    <div className="wrap">
                      <span id={item._id} className={`contact-status ${statusListClass[item.status]}`}></span>
                      <img src={ item.avatar || NO_IMAGE } alt="avatar" />
                      <div className="meta">
                        <p className="name">{ `${item.firstname} ${item.lastname}` }</p>
                        <p className="preview">{ item.description || '' }</p>
                      </div>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
} 