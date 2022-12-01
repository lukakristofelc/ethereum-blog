import React, { Component } from 'react';
import './ObjavaComponent.css';

export class ObjavaComponent extends React.Component {

  constructor(props) {
    super(props);
    this.id = props.id;
    this.author = props.author;
    this.authorKey = props.authorKey;
    this.content = props.content;
    this.timestamp = props.timestamp;
    this.isMod = props.isMod;
    this.contract = props.contract;
    
    this.deletePost = this.deletePost.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async deletePost() {
    try {
      console.log(this.contract.deletePost)
      await this.contract.deletePost(this.id.toNumber());
    }
    catch(error) {
      console.log(error);
    }
  }

  handleClick() {
    this.props.setProfileView();
    this.props.setForeignAddress(this.authorKey);
    this.props.setUsername(this.author);
  }

  render() {
    return (
      <div className='objava'>
        <div className="objava-content">
          <button className='author' onClick={this.handleClick}>{this.author}</button>
          <div className='vsebina'>{this.content}</div>
          <div className='timestamp'>{this.timestamp}</div>
          {this.isMod ? <button onClick={this.deletePost}>DELETE</button> : <div/>}
        </div>
      </div>
    )
  }
}