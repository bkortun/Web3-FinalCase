// SPDX-License-Identifier: MIT

pragma solidity  >=0.8.2 <0.9.0;

contract Rental{
    //hirer => kiracı
    //renter => mal sahibi

    event SendReport(address indexed _user,Report report);

    mapping (address=>Property) public propertiesOfUsers ;

    mapping (uint=>Agreement) public agreements ;
    uint[] public agreementIds;

    Report[] reports ;

    enum PropertyType{
        Residential,
        Commercial
    }

    struct Property{
        string name;
    }

    struct Hirer{
        address id;
        string fullName;
    }

    struct Renter{
        address id;
        string fullName;
    }


    struct Tenancy{
        Hirer hirer;
        address tenancyAddress;
        Renter renter;
    }

    struct Agreement{
        uint id;
        Tenancy tenancy;
        uint startDate;
        uint endDate;    
    }

    struct Report{
        Hirer hirer;
        Property property;
        string subject;
        string message;
        uint createdDate;
    }

    modifier isHirer(){
        _;
    }

    modifier isRenter(){
        _;
    }
   
    

    function enterProperty(string memory propertyName) isRenter public{
        Property memory _property;
        _property.name=propertyName;
        propertiesOfUsers[msg.sender] = _property;
    }

    function rent(Agreement memory agreement) isRenter  public{
        agreements[agreement.id] = agreement;
        agreementIds.push(agreement.id);
    }

    function finishRent(uint agreementId) isRenter  public{
        delete agreements[agreementId];
        
        for (uint i = 0; i < agreementIds.length; i++) {
            if (agreementIds[i] == agreementId) {
                agreementIds[i] = agreementIds[agreementIds.length - 1];
                agreementIds.pop();
                break;
            }
        }
    }

    function sendReportToRenter(Report memory report) isHirer public{
        emit SendReport(msg.sender,report);
        reports.push(report);
    }
}