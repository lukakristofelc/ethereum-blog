import React from 'react';
import './FeedComponent.css';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';
import { ForeignProfile } from '../ForeignProfileComponent/ForeignProfileComponent';

export class Feed extends React.Component {

    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.contract = props.contract;
        this.isMod = props.isMod;

        this.getPosts = this.getPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.setFeedView = this.setFeedView.bind(this);
        this.setProfileView = this.setProfileView.bind(this);
        this.setForeignAddress = this.setForeignAddress.bind(this);
        this.setUsername = this.setUsername.bind(this);

        this.state = {
            posts: [],
            view: 'F',
            username: '',
            foreignAddress: '',
            input:''
        }
    }

    async getPosts() {    
        try {
          let objaveList = await this.contract.getPosts();
          this.setState({posts: orderPosts(objaveList)});
    
        } catch(e) {
          console.log(e);
        }
    }

    async addPost() {
        try {
            if (this.state.input == "")
            {
                alert("Your post cannot be empty.");
                return;
            }
            await this.contract.addPost(this.state.input);
            this.setState({input:''});   
        } catch(error) {
            console.log(error);
        }
    }  

    setProfileView() {
        this.setState({view: 'FP'});
    }

    setFeedView() {
        this.setState({view: 'F'});
    }

    setForeignAddress(foreignAddress) {
        this.setState({foreignAddress: foreignAddress});
    }

    setUsername(username) {
        this.setState({username: username});
    }

    render() {
        if (this.state.view === 'F')
        {
            this.getPosts();
            return(  
                <div>
                    <textarea 
                        type="text"
                        placeholder="Insert new post"
                        onChange={e => this.setState({input: e.target.value})}
                        value={this.state.input}
                        rows="8" cols="50"
                    />
                    <br/>
                    <button onClick={this.addPost}>POST</button> <br/>
                    {
                    this.state.posts.map(objava =>
                        <ObjavaComponent    key={objava['id']}
                                            id={objava['id']}
                                            author={objava['author']}
                                            authorKey={objava['pubkey']}
                                            content={objava['content']} 
                                            timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()}
                                            setProfileView={this.setProfileView}
                                            setFeedView={this.setFeedView}
                                            setForeignAddress={this.setForeignAddress}
                                            setUsername={this.setUsername}
                                            isMod={this.isMod}
                                            contract={this.contract}
                                            currentUser={this.currentUser}
                                            isProfile={false}
                        />)
                    }
                </div>)
        }
        else
        {
            this.props.setForeignProfileView(this.state.foreignAddress, this.state.username);
        }
    }
}


const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
  }