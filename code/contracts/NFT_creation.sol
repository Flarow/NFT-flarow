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

contract NFT_creation is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //Counters.Counter private _itemIDs;
    address contractAddress;

//    uint[] _itemsCreated;

    constructor(address marketAddress) ERC721("NFT_Flarow", "NFTF") {
        contractAddress = marketAddress;
    }

    function createNFT(address owner, string memory tokenURI) public{
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(owner, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress,true);
        //return newItemId;
    }

    function latestID() view public returns (uint256){
        return _tokenIds.current();
    }
}