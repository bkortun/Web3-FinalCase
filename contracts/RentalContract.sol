// SPDX-License-Identifier: MIT

pragma solidity  >=0.8.2 <0.9.0;

contract Rental{
    struct Agreement{
        string hirerName;
        string hirerAddress;
        string renterName;
        PropertyType propertyType;
        string property;
    }

    enum PropertyType{
        Residential,
        Commercial
    }

    struct Property{
        string name;
        uint startDate;
        uint endDate;
    }

    function rent() isRenter pure public{

    }

    function finishRent() public{

    }

    modifier isRenter(){
        _;
    }

    function enterProperty() isRenter public{

    }
}