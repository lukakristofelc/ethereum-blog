import './App.css';
import { useState } from "react"
import { ethers } from 'ethers';
import Blog from './utils/Blog.json'
import { SwitcherComponent } from './Components/SwitcherComponent/SwitcherComponent';
import { ModeratorAddress, BlogContractAddress } from './config.js'

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isMod, setIsMod] = useState();
  const [showTextarea, setShowTextArea] = useState();
  const [username, setUsername] = useState('');
  const connectContract = () => {
    const {ethereum} = window;
  
    if (!ethereum) {
      console.log('Ethereum object does not exist');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const BlogContract = new ethers.Contract(
      BlogContractAddress,
      Blog.abi,
      signer
    )
  
    return BlogContract;
  }

  const contract = connectContract();


  async function createUser() {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setIsMod(accounts[0].toLowerCase() === ModeratorAddress.toLowerCase());

      await contract.createNewUser(username, accounts[0].toLowerCase() === ModeratorAddress.toLowerCase());

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try{
      const {ethereum} = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setIsMod(accounts[0].toLowerCase() === ModeratorAddress.toLowerCase());

      if (!await contract.doesUserExist(accounts[0]))
      {
        setShowTextArea(true);
      }
      else
      {
        setCurrentAccount(accounts[0]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (currentAccount === '')
  {
    return (<div>
              <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
              <div>
                { showTextarea ? <div className='sign-up-panel'>
                                    <p style={{textAlign: 'center'}}>Please pick a username:</p> <br />
                                    <textarea
                                      id='username' 
                                      type="text"
                                      placeholder="Username"
                                      onChange={e => setUsername(e.target.value)}
                                      rows="8" cols="50"
                                    /> 
                                    <button onClick={createUser}>SIGN UP</button> 
                                  </div> : 
                                  <div>
                                    <p style={{textAlign: 'center'}}>Please connect the Metamask wallet to continue:</p> 
                                    <button onClick={connectWallet}>Connect Wallet</button> 
                                  </div>}
              </div>
            </div>)
  }
  else
  {
    return (<div>
      <SwitcherComponent currentUser={currentAccount} isMod={isMod}/>
    </div>)
  }
}

export default App;