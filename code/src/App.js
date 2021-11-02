import React, { Component ,useState,useEffect} from 'react';
import { Button, Form } from 'semantic-ui-react'
import "./App.css"
import axios from 'axios'
import ipfs from "./ipfs"
import web3 from "./utils/InitWeb3"
let nftMarketContract =require("./eth/marketeth")
let nftCreationContract=require("./eth/nfteth")

function App() {
  const addressMarket=nftMarketContract.options.address
  const addressCreation=nftCreationContract.options.address
  const [nfts1, setNfts1] = useState([])//all selling
  const [nfts2, setNfts2] = useState([])//created
  const [nfts3, setNfts3] = useState([])//can be sold
  const [nfts4, setNfts4] = useState([])//my selling
  const [nfts5, setNfts5] = useState([])//bought
  const [nfts6, setNfts6] = useState([])//unclaimed
  const [ipfsimg, setimg] = useState({ipfsHash:null,buffer:'',creationAddress:''})
  useEffect(() => {
    checktime()
    loadAllSellingItems()
    loadMyCreations()
    loadMyForSellItems()
    loadMySellingItems()
    loadMyBoughtItems()
    loadMyUnclaimedItems()
  }, [])
  /* state = {
    ipfsHash:null,
    buffer:'',
    creationAddress:'',
    blockNumber:'',
    transactionHash:'',
    gasUsed:'',
    txReceipt: ''
  }; */
  //check time
  async function checktime(){
    var timestamp= new Date().getTime();
    timestamp= (timestamp - timestamp%1000)/1000;
    await nftMarketContract.methods.checkTimeLimitForAll(timestamp).send({from:addressMarket,gas:"300000"});
  }
  //all selling
  async function loadAllSellingItems(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.allNFTsSelling().call({from:accounts[0]});//.then(function(result){return result[0]})

    const itemshere = await Promise.all(data.map(async i =>{
        const iteminfo= await nftMarketContract.methods.getItemfromId(i).call();
        const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId);
        const meta = await axios.get(tokenuri);
        let item = {
          _itemid: iteminfo.itemId,
          _price: iteminfo.price,
          _name: meta.data.name,
          _desc: meta.data.description,
          _image: meta.data.image,
          _timelim: iteminfo.timeLimit,
          _formercount: iteminfo.former_owners_count,
          _formerlist: iteminfo.former_owners
        }
        return item
    }));
    setNfts1(itemshere);
  }

  //created
  async function loadMyCreations(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.getMyCreatedNFTs().call({from:accounts[0]});

    const itemshere = await Promise.all(data.map(async i =>{
      const iteminfo= await nftMarketContract.methods.getItemfromId(i).call();
      const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId).call();
      const meta = await axios.get(tokenuri);
      let item = {
        _itemid: iteminfo.itemId,
        _price: iteminfo.price,
        _name: meta.data.name,
        _desc: meta.data.description,
        _image: meta.data.image,
        _timelim: iteminfo.timeLimit,
        _formercount: iteminfo.former_owners_count,
        _formerlist: iteminfo.former_owners
      }
      return item
  }));
  setNfts2(itemshere);
  }
  //mine can be sold
  async function loadMyForSellItems(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.getMyNftForSell().call({from:accounts[0]});

    const itemshere = await Promise.all(data.map(async i =>{
      const iteminfo= await nftMarketContract.methods.getItemfromId(i);
      const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId);
      const meta = await axios.get(tokenuri);
      let item = {
        _itemid: iteminfo.itemId,
        _price: iteminfo.price,
        _name: meta.data.name,
        _desc: meta.data.description,
        _image: meta.data.image,
        _timelim: iteminfo.timeLimit,
        _formercount: iteminfo.former_owners_count,
        _formerlist: iteminfo.former_owners
      }
      return item
  }));
  setNfts3(itemshere);
  }

  //my selling
  async function loadMySellingItems(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.getMySellingNFTs().call({from:accounts[0]});

    const itemshere = await Promise.all(data.map(async i =>{
      const iteminfo= await nftMarketContract.methods.getItemfromId(i);
      const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId).call();
      const meta = await axios.get(tokenuri);
      let item = {
        _itemid: iteminfo.itemId,
        _price: iteminfo.price,
        _name: meta.data.name,
        _desc: meta.data.description,
        _image: meta.data.image,
        _timelim: iteminfo.timeLimit,
        _formercount: iteminfo.former_owners_count,
        _formerlist: iteminfo.former_owners
      }
      return item
  }));
  setNfts4(itemshere);
  }

  //bought from others
  async function loadMyBoughtItems(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.getMyBoughtNFTs().call({from:accounts[0]});

    const itemshere = await Promise.all(data.map(async i =>{
      const iteminfo= await nftMarketContract.methods.getItemfromId(i).call();
      const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId).call();
      const meta = await axios.get(tokenuri);
      let item = {
        _itemid: iteminfo.itemId,
        _price: iteminfo.price,
        _name: meta.data.name,
        _desc: meta.data.description,
        _image: meta.data.image,
        _timelim: iteminfo.timeLimit,
        _formercount: iteminfo.former_owners_count,
        _formerlist: iteminfo.former_owners
      }
      return item
  }));
  setNfts5(itemshere);
  }

  //unclaimed items
  async function loadMyUnclaimedItems(){
    const accounts = await web3.eth.getAccounts();
    const data = await nftMarketContract.methods.getMyNFTsUnclaimed().call({from:accounts[0]});

    const itemshere = await Promise.all(data.map(async i =>{
      const iteminfo= await nftMarketContract.methods.getItemfromId(i).call();
      const tokenuri=await nftCreationContract.methods.tokenURI(iteminfo.tokenId).call();
      const meta = await axios.get(tokenuri);
      let item = {
        _itemid: iteminfo.itemId,
        _price: iteminfo.price,
        _name: meta.data.name,
        _desc: meta.data.description,
        _image: meta.data.image,
        _timelim: iteminfo.timeLimit,
        _formercount: iteminfo.former_owners_count,
        _formerlist: iteminfo.former_owners
      }
      return item
  }));
  setNfts6(itemshere);
  }

  async function placeabid(theitem,thei){
    const accounts = await web3.eth.getAccounts();
    const BidPrice=document.getElementById("bidprice"+thei).value.toNumber();
    await nftMarketContract.methods.PlaceABid(theitem._itemid,BidPrice).send({from:accounts[0],gas:"300000"});
  }

  async function createasell(theitem,thei){
    const accounts = await web3.eth.getAccounts();
    const saledays=document.getElementById("sellday"+thei).value.toNumber()*86400000;
    const salehour=document.getElementById("sellhour"+thei).value.toNumber()*3600000;
    const salemin=document.getElementById("sellmin"+thei).value.toNumber()*60000;
    const saleprice=document.getElementById("sellprice"+thei).value.toNumber();
    var salelimit=new Date().getTime();
    salelimit+=saledays+salehour+salemin;
    salelimit=(salelimit-salelimit%1000)/1000;
    await nftMarketContract.methods.CreateASell(theitem._itemid,saleprice,salelimit).send({from:accounts[0],gas:"500000"});
  }

  async function claimNFT(theitem){
    const accounts = await web3.eth.getAccounts();
    await nftMarketContract.methods.claimMyNFT(addressCreation,theitem._itemid).send({from:accounts[0],value:theitem._price,gas:"500000"});
  }

  async function captureFile(event) {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => convertToBuffer(reader) 
  }
  async function convertToBuffer(reader) {
      const buffer = await Buffer.from(reader.result);
      this.setState({buffer});
  }

  async function createAnNFT (event){
      event.preventDefault();
      console.log('running');
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);
      const creationAddress = addressCreation;
 //     const marketAddress = await nftMarketContract.options.address;
      setimg({creationAddress});
      const added = await ipfs.add(ipfsimg.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        setimg({ ipfsHash:ipfsHash[0].hash });
      });
      const fileurl=`https://ipfs.infura.io/ipfs/${added.path}`;
//upload the image
      const nftName=document.getElementById("NFTname").value;
      const nftDesc=document.getElementById("NFTdesc").value;
      const nftPrice=document.getElementById("NFTprice").value.toNumber();
      //const nftImage=document.getElementById("NFTimage").value;
      const data = JSON.stringify({
        name:nftName, description:nftDesc, image: fileurl
      });
      const urladded=await ipfs.add(data);
      const url=`https://ipfs.infura.io/ipfs/${urladded.path}`;
//upload the .json of the token
      const tokenid = await nftCreationContract.methods.createNFT(accounts[0],url).send(
        {from:accounts[0],gas:'300000'}
      ).on('receipt',function(receipt){
        return nftCreationContract.methods.latestID().call();
      });
      //const tokenid = tokenEvent.args[2].toNumber();
      await nftMarketContract.methods.CreateMarketItems(creationAddress,tokenid,nftPrice).send(
        {from:accounts[0],gas:'500000'}
      );
      document.getElementById("NFTname").innerHTML="";
      document.getElementById("NFTdesc").innerHTML="";
      document.getElementById("NFTprice").innerHTML="";
      //create new items
  };
  return (
    <div style={{width:'100%'}}>
    <ul className="direct">
      <li> <p style={{backgroundColor:"#66CCFF",fontSize:"24px"}}><b>NFT MARKET</b></p></li>
      <li> <a href="#market"> NFT市场</a> </li>
      <li> <a href="#create"> 铸造NFT</a> </li>
      <li> <a href="#mynfts"> 我的NFT</a> </li>
    </ul>
    <div style={{width:"73%",marginLeft:"27%"}}>
      <div className="container" >
        <h2><a id="market">NFT市场</a></h2>
        {
          nfts1.map( (nft,i) => (
            <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
              <img src={nft.img} style={{width:"100%"}}/>
              <p><b>Name:</b>{nft.name}</p><br/>
              <p><b>Description:</b>{nft.description}</p><br/>
              <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
              <p><b>Finish At:</b>{new Date(nft.timelim).toLocaleString()}</p><br/>
              <Form>
              <input type="text" id={"bidprice"+i} size="30"/><b>Wei</b>
              <Button onclick={placeabid(nft,i)}>Bid!</Button>
              </Form>
            </div>
          ))
        }
      </div>
      <hr/>
      <hr/>
      <div className="container">
        <h2><a id="create">铸造NFT</a></h2>
        <Form>
          <b>NFT name: </b><input type="text" id="NFTname" size="30"/><br/>
          <b>NFT description: </b><input type="text" id="NFTdesc" size="80"/><br/>
          <b>NFT price: </b><input type="text" id="NFTprice" size="50"/> <b>Wei</b><br/>
          <b>Upload your image:</b>
          <input type="file" id="nftimage" accept="image/png, image/jpeg" onchange={captureFile}/><br/>
          <Button style={{width:"50px",height:"30px"}} onclick={createAnNFT}>确认</Button>
        </Form>
      </div>
      <hr/>
      <hr/>
      <div className="container">
        <h2><a id="mynfts">我的NFT</a></h2>
        <hr/>
        <div className="container" key={2}>
          <h3>my creation</h3>
          {
            nfts2.map( (nft,i) => (
              <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
                <img src={nft.img} style={{width:"100%"}}/>
                <p><b>Name:</b>{nft.name}</p><br/>
                <p><b>Description:</b>{nft.description}</p><br/>
                <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
              </div>
            ))
          }
        </div>
        <hr/>
        <div className="container" key={3}>
          <h3>NFTs can be sold</h3>
          {
            nfts3.map( (nft,i) => (
              <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
                <img src={nft.img} style={{width:"100%"}}/>
                <p><b>Name:</b>{nft.name}</p><br/>
                <p><b>Description:</b>{nft.description}</p><br/>
                <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
                <p>Input a time between 10 minutes and 15days!</p>
                <Form>
                <input type="text" id={"sellday"+i} size="10"/><b>days</b><br/>
                <input type="text" id={"sellhour"+i} size="10"/><b>hours</b><br/>
                <input type="text" id={"sellmin"+i} size="10"/><b>minutes</b><br/>
                <input type="text" id={"sellprice"+i} size="30"/><b>Wei</b>
                <Button onclick={createasell(nft,i)}>Start a sale</Button>
                </Form>
              </div>
            ))
          }
        </div>
        <hr/>
        <div className="container" key={4}>
          <h3>NFTs on sale</h3>
          {
            nfts4.map( (nft,i) => (
              <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
                <img src={nft.img} style={{width:"100%"}}/>
                <p><b>Name:</b>{nft.name}</p><br/>
                <p><b>Description:</b>{nft.description}</p><br/>
                <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
                <p><b>Finish At:</b>{new Date(nft.timelim).toLocaleString()}</p><br/>
              </div>
            ))
          }
        </div>
        <hr/>
        <div className="container" key={5}>
          <h3>NFTs bought</h3>
          {
            nfts5.map( (nft,i) => (
              <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
                <img src={nft.img} style={{width:"100%"}}/>
                <p><b>Name:</b>{nft.name}</p><br/>
                <p><b>Description:</b>{nft.description}</p><br/>
                <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
              </div>
            ))
          }
        </div>
        <hr/>
        <div className="container" key={6}>
          <h3>NFTs unclaimed</h3>
          {
            nfts6.map( (nft,i) => (
              <div key={i} style={{border:"solid 1px",width:"30%",height:"300px",marginLeft:"2%",marginRight:"2%",overflow:'auto'}}>
                <img src={nft.img} style={{width:"100%"}}/>
                <p><b>Name:</b>{nft.name}</p><br/>
                <p><b>Description:</b>{nft.description}</p><br/>
                <p><b>Price:</b>{nft.price}<b>Wei</b></p><br/>
                <Button onclick={claimNFT(nft)}>Bid!</Button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  );
}


export default App;
