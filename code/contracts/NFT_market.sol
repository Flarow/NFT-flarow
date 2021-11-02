// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/utils/Counters.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC721/ERC721.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

import "@OpenZeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@OpenZeppelin/contracts/utils/Counters.sol";
import "@OpenZeppelin/contracts/token/ERC721/ERC721.sol";
//import "@OpenZeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT_market{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIDs;
    Counters.Counter private _sellCreated;
    Counters.Counter private _sellDone;

    address _owner;
    constructor() payable{
        _owner=msg.sender;
        msg.value;
    }
    
    uint[] _items;

    struct Item_held
    {
        uint itemId;
        address nftMarket;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable last_bidder;
        uint256 price;
        //bool Selling;
        uint256 timeLimit;
        uint former_owners_count;
        //mapping(uint => address) former_owners;
        address[] former_owners;
    }

    mapping(uint256 => Item_held) idToMarketItems;

    event newItemAccept(
        uint indexed itemId,
        address indexed nftMarket,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
        );

    function getItemfromId(uint256 _ItemId) view public returns(Item_held memory){
        return idToMarketItems[_ItemId];
    }

    function CreateMarketItem(address nftmarket,uint256 tokenId,uint256 price) public payable{
        require(price>0,"Don't be free!");
        _itemIDs.increment();
        uint256 itemId=_itemIDs.current();
        _items.push(itemId);

        idToMarketItems[itemId]=Item_held(
            itemId,
            nftmarket,
            tokenId,
            payable(address(0)),
            payable(msg.sender),
            payable(address(0)),
            price,
            //0,
            0,//timeLimit
            0,//former_owners_count
            new address[](0)
            );

        IERC721(nftmarket).safeTransferFrom(msg.sender,address(this),tokenId);

        emit newItemAccept(itemId,nftmarket,tokenId,msg.sender,address(0),price);
    }

    function CreateASell(uint256 _itemId,uint256 _price,uint256 time_lim)  public {
        require(time_lim>=600 && time_lim<=1296000,"Time should be set between 10 minutes and 15 days!");
        
        //idToMarketItems[_itemId].Selling=1;
        idToMarketItems[_itemId].seller=idToMarketItems[_itemId].owner;
        idToMarketItems[_itemId].owner=payable(address(0));
        idToMarketItems[_itemId].last_bidder=idToMarketItems[_itemId].seller;
        idToMarketItems[_itemId].price=_price;
        idToMarketItems[_itemId].timeLimit=block.timestamp+time_lim;
        _sellCreated.increment();
    }

    function PlaceABid(uint256 _itemId,uint256 _price) public {
        require(_price>idToMarketItems[_itemId].price,"You need to pay more price for it!");

        idToMarketItems[_itemId].price=_price;
        idToMarketItems[_itemId].last_bidder=payable(msg.sender);

    }

    function checkTimeLimitForAll(uint256 timenow) public{
        uint256 idlim=_itemIDs.current();
        for (uint i=1;i<=idlim;i++)
        {
            if (idToMarketItems[i].timeLimit!=0 && idToMarketItems[i].timeLimit<timenow)
            {
                idToMarketItems[i].timeLimit=0;
                _sellDone.increment();
            }
        }
    }

    function claimMyNFT(address nftmarket,uint256 _itemId) public payable {
        require(msg.sender == idToMarketItems[_itemId].last_bidder,"This isn't your nft.");
        
        IERC721(nftmarket).safeTransferFrom(idToMarketItems[_itemId].seller,msg.sender,idToMarketItems[_itemId].tokenId);
        uint256 deal_price=msg.value*990/1000;//platform gets 1%
        idToMarketItems[_itemId].seller.transfer(deal_price);
        payable(address(this)).transfer(msg.value-deal_price);

        idToMarketItems[_itemId].former_owners_count++;
        idToMarketItems[_itemId].former_owners.push(idToMarketItems[_itemId].seller);
        idToMarketItems[_itemId].owner=payable(msg.sender);
        idToMarketItems[_itemId].seller=payable(address(0));
        idToMarketItems[_itemId].last_bidder=payable(address(0));
        //idToMarketItems[_itemId].Selling=0;
        //idToMarketItems[_itemId].timeLimit=0;
        
    }
    //all NFTs created by msg.sender
    function getMyCreatedNFTs() view public returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256[] memory res=new uint256[](idlim);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
        {
            if (idToMarketItems[i].former_owners_count!=0)
            {
                if (idToMarketItems[i].former_owners[1]==msg.sender)
                    res[++totalcount]=idToMarketItems[i].itemId;
            }
            else if (idToMarketItems[i].owner==msg.sender)
                res[++totalcount]=idToMarketItems[i].itemId;
        }
        return res;
    }
    //all NFTs can be sold by msg.sender
    function getMyNftForSell() view public returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256[] memory res=new uint256[](idlim);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
            if (idToMarketItems[i].owner==msg.sender)
                res[++totalcount]=idToMarketItems[i].itemId;
        return res;
    }
    //all NFTs selling by msg.sender
    function getMySellingNFTs() view public returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256[] memory res=new uint256[](idlim);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
            if (idToMarketItems[i].seller==msg.sender && idToMarketItems[i].timeLimit<block.timestamp)
                res[++totalcount]=idToMarketItems[i].itemId;
        return res;
    }
    //all NFTs bought by msg.sender,except for those created by msg.sender and those are selling
    function getMyBoughtNFTs() view public returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256[] memory res=new uint256[](idlim);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
            if (idToMarketItems[i].owner==msg.sender && idToMarketItems[i].former_owners[1]!=msg.sender)
                res[++totalcount]=idToMarketItems[i].itemId;
        return res;
    }
    //all NFTs need to be claimed
    function getMyNFTsUnclaimed() view public returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256[] memory res=new uint256[](idlim);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
            if (idToMarketItems[i].timeLimit==0 && idToMarketItems[i].last_bidder==msg.sender)
                res[++totalcount]=idToMarketItems[i].itemId;
        return res;
    }
    //load all NFTs selling
    function allNFTsSelling() public view returns(uint256[] memory){
        uint256 idlim=_itemIDs.current();
        uint256 maxcount=_sellCreated.current()-_sellDone.current();
        uint256[] memory res=new uint256[](maxcount);
        uint256 totalcount=0;
        for (uint i=1;i<=idlim;i++)
            if (idToMarketItems[i].seller!=payable(address(0)))
            {
                if (idToMarketItems[i].timeLimit<block.timestamp)
                    res[++totalcount]=idToMarketItems[i].itemId;
            }
        return res;
    }

    function supportmarket(uint256 _price) public payable returns(uint256){
        payable(address(this)).transfer(_price);
        return _price;
    }

}