// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract ParibuHub{

    bool public allowed; 
    uint public count;
    int public signedCount;
    address public owner;
    mapping(address => mapping(address => bool)) public allowance;
    string[] public errorMessages;

    struct Account {
        string name;
        string surname;
        uint256 balance;
    }

    Account account;
    mapping(address => Account) public accountValues;
    Account[] public admins;
    uint private index;

    function addAdmin(Account memory admin) public {
       admins.push(admin);
    }

    function getAllAdmins() public view returns(Account[] memory) {
        return admins;
    }
}
















    
