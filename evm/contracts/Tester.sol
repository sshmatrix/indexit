// Author: indexit.eth
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Tester {
    event Print(string);
    function convert(string memory utf8) public  {
        emit Print(string(utf8));
    }
}
