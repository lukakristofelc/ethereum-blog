import React from 'react';
import './ChatComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';

export class ChatComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.contract = props.contract;
        this.sendMessage = this.sendMessage.bind(this);
        this.getChat = this.getChat.bind(this);
        this.closeChat = props.closeChat;

        this.state = {
            chat: [],
            input: "",
            currentChatAddress: props.currentChatAddress,
            name: props.name
        }
    }

    async sendMessage() {
        if(this.state.input == "") {
            alert("Cannot send empty message");
            return;
        }
        try {
            await this.contract.sendMessage(this.state.currentChatAddress, this.state.input);
            this.setState({input:''});  
        } catch (error) {
            console.log(error);
        }
    }

    async getChat(address) {
        try {
            let chat = await this.contract.getChat(address);
            let reversedChat = [... chat].reverse();
            this.setState({chat: reversedChat});
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (this.state.currentChatAddress != undefined) {
            this.getChat(this.state.currentChatAddress);
        }
        return(
            <div className='composer'>
                <div className="close-button">
                    <button onClick={() => this.props.setForeignProfileView(this.state.currentChatAddress, this.state.name)}>VISIT PROFILE</button>
                    <button onClick={this.closeChat}>CLOSE CHAT</button>
                </div>
                <div className="message-composer">
                    <div className="messages">
                        {this.state.chat.map(message => <p key={message[0]}><span id='sender_name'>{message[2]+": "}</span><br/>{message[4]}</p>)}
                    </div>  
                    <textarea 
                            type="text"
                            id='message_input'
                            placeholder="Insert new message"
                            onChange={e => this.setState({input: e.target.value})}
                            value={this.state.input}
                            rows="8" cols="50"
                        />
                    <button id='message_send' onClick={this.sendMessage}>SEND</button>
                </div>
            </div>
        )
    }
}