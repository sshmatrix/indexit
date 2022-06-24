// Author: indexit.eth
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./StringUtils.sol";

abstract contract ENS {
    function resolver(bytes32 node) public virtual view returns (Resolver);
}

abstract contract Resolver {
    function addr(bytes32 node) public virtual view returns (address);
}

contract IndexIt is ERC721URIStorage, Ownable {
    using StringUtils for *;

    // Prices
    uint256 public constant priceTier1 = 10000000000000000;
    uint256 public constant priceTier2 = 1000000000000000;
    uint256 public constant priceTier3 = 500000000000000;
    uint256 public constant priceIdiotClub = 1000000000000000000;

    // Debugger
    event Print(address indexed, address indexed, address indexed);
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("indexitv0", "IND0") {
    }
    
    // Library
    function append(string memory a, string memory b, string memory c, string memory d, string memory e) 
    internal 
    pure 
    returns (string memory) 
    {
        return string(abi.encodePacked(a, b, c, d, e));
    }

    function add(string memory a, string memory b) 
    internal 
    pure 
    returns (string memory) 
    {
        return string(abi.encodePacked(a, b));
    }

    function splitSignature(bytes memory signature)
    internal
    pure
    returns (uint8, bytes32, bytes32)
    {
        require(signature.length == 65, "Signature length != 65");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(signature, 32))
            // second 32 bytes
            s := mload(add(signature, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(signature, 96)))
        }
        return (v, r, s);
    }
    
    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    // Resolves ENS
    function computeNameHash(string memory name) public pure returns (bytes32 namehash) {
        namehash = 0x0000000000000000000000000000000000000000000000000000000000000000;
        namehash = keccak256(abi.encodePacked(namehash, keccak256(abi.encodePacked('eth'))));
        namehash = keccak256(abi.encodePacked(namehash, keccak256(abi.encodePacked(name))));
        return namehash;
    }

    ENS ens = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    function resolve(bytes32 node) public view returns(address) {
        Resolver resolver = ens.resolver(node);
        return resolver.addr(node);
    }
    
    // Recovers signature
    function recoverSigner(bytes32 hash, bytes memory signature) internal pure
    returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(signature);
        return ecrecover(hash, v, r, s);
    }
    
    // Sets the mint price based on club
    function price(
        string memory name
    ) public pure returns (uint256) {
        uint256 len = name.strlen();
        uint256 mintPrice;

        if (len == 3) {
            mintPrice = priceTier1;
        } else if (len == 4) {
            mintPrice = priceTier2;
        } else if (len >= 5) {
            mintPrice = priceTier3;
        } else {
            mintPrice = priceIdiotClub;
        }
        
        return mintPrice;
    }

    function mintToken(bytes32 hash, string memory message, bytes memory signature, string memory uri, string memory name)
        public
        payable
    {
        bytes32 payloadHash = keccak256(abi.encode(hash, message));
        bytes32 messageHash = prefixed(payloadHash);
        address signer = recoverSigner(messageHash, signature);
        bytes32 nameHash = computeNameHash(name);
        address owner = resolve(nameHash); // Results in 'Fail' transaction if ENS is not owned
        emit Print(msg.sender, owner, signer);
        // Require: Minter = Signer
        require(msg.sender == signer, "Minter & Signer are not same");
        // Require: Minter = Owner (fail safe)
        require(msg.sender == owner, "Minter & Owner are not same");
        // Require: Owner = Signer (fail safe)
        require(owner == signer, "Owner & Signer are not same");
        uint256 newTokenID = _tokenIds.current();
        uint256 mintPrice = price(name);
        require(msg.value >= mintPrice, "Insufficient ether sent");
        string memory tokenURI = append("https://indexit.club/public/", uri, "/", uri, ".json");
        _mint(msg.sender, newTokenID);
        _setTokenURI(newTokenID, tokenURI);
        _tokenIds.increment();
    }
}
