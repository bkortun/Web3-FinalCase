// SPDX-License-Identifier: MIT

pragma solidity  >=0.8.2 <0.9.0;

contract Rental{
    //hirer => kiracı
    //renter => mal sahibi

    address private admin;

    constructor() {
        admin=msg.sender;
    }


    event LogMessage(string message);

    function log(string memory message) public {
        emit LogMessage(message);
    }

    event SendReport(address indexed _user,Report report);
    event SendReason(address indexed _user,string reason);

    Property[] private properties;
    Agreement[] private agreements;
    address[] private renters;
    address[] private hirers;

    Report[] private reports ;
    address[] private suspendedRenters;
    address[] private suspendedHirers;

    function getProperties() public view returns (Property[] memory){
        return properties;
    }
    function getAgreements() public view returns (Agreement[] memory){
        return agreements;
    }
    function getRenters() public view returns (address[] memory){
        return renters;
    }
    function getHirers() public view returns (address[] memory){
        return hirers;
    }
    function getReports() public view returns (Report[] memory){
        return reports;
    }
    function getSuspendedRenters() public view returns (address[] memory){
        return suspendedRenters;
    }
    function getSuspendedHirers() public view returns (address[] memory){
        return suspendedHirers;
    }


    uint private  propertyId=0;
    uint private agreementId=0;
    uint private reportId=0;


    struct Property{
        uint id;
        string name;
        address owner; //renter
        string location;
        PropertyType propertyType;
    }

    enum PropertyType{
        Residential,
        Commercial
    }


    struct Agreement{
        uint id;
        AgreementStatus agreementStatus;
        Property property;
        address hirer;
        uint startDate;
        uint endDate;    
    }

    enum AgreementStatus{
        Finished,
        PendingByRenter, //=> Mülk sahibi işlemi beklemeye aldı
        PendingByHirer,  //=> kiracı işlemi beklemeye aldı
        Continues
    }

    struct Report{
        uint id;
        Agreement agreement;
        string subject;
        string message;
        uint createdDate;
        SenderType senderType;
    }

    enum SenderType{
        Renter,
        Hirer
    }

    modifier isHirer(){
        (bool result, uint index) = findAddress(hirers, msg.sender);
        require(result,"You must be hirerer for doing this action");
        _;
    }

    modifier isRenter(){
        (bool result, uint index) = findAddress(renters, msg.sender);
        require(result,"You must be renter for doing this action");
        _;
    }

    modifier isMemberOfAgreement(){
        (bool resultR, uint indexR) = findAddress(renters, msg.sender);
        (bool resultH, uint indexH) = findAddress(hirers, msg.sender);
        require(resultR||resultH,"You must be member of the agreement for doing this action");
        _;
    }

    modifier isAdmin(){
        require(msg.sender==admin,"You must be admin for doing this action");
        _;
    }

    function findAddress(address[] memory addressList,address _targetAddress) private pure returns (bool, uint) {
        for (uint i = 0; i < addressList.length; i++) {
            if (addressList[i] == _targetAddress) {
                return (true, i);
            }
        }
        return (false, 0); 
    }
   

    function enterProperty(string memory propertyName, string memory location, PropertyType propertyType) public{
        (bool result,) = findAddress(suspendedRenters, msg.sender);
        require(!result,"You do not have permission to perform this action");
        Property memory _property;
        _property.id=propertyId;
        _property.name=propertyName;
        _property.location=location;
        _property.propertyType=propertyType;
        _property.owner=msg.sender;

        properties.push(_property);
        if (!isElementExist(msg.sender)){
            renters.push(msg.sender);
        }
        
        propertyId=propertyId+1;
    }

    function isElementExist(address element) public view returns (bool) {
        for (uint i = 0; i < renters.length; i++) {
            if (keccak256(abi.encodePacked(renters[i])) == keccak256(abi.encodePacked(element))) {
                return true;
            }
        }
        return false;
    }

    function rent(uint _propertyId,address hirer,uint startDate,uint endDate) isRenter  public{
        require(startDate>=block.timestamp,"Start date can't assign to a past date");
        require(endDate>=block.timestamp,"End date can't assign to a past date");
        require(msg.sender!=hirer,"In a agreement, the hirer and the renter cannot be the same person");

        Property memory property=properties[_propertyId];
        require(msg.sender==property.owner,"The property entered does not belong to you");

        (bool result,) = findAddress(suspendedHirers, hirer);
        require(!result,"You do not have permission to perform this action");

        Agreement memory _agreement;
        _agreement.id=agreementId;
        _agreement.agreementStatus=AgreementStatus.Continues;
        _agreement.endDate=endDate;
        _agreement.startDate=startDate;
        _agreement.hirer=hirer;
        _agreement.property=property;

        agreements.push(_agreement);
        hirers.push(hirer);
        agreementId=agreementId+1;

    }

    function finishRent(uint _agreementId, string memory reason) isMemberOfAgreement  public{
        Agreement memory agreement =agreements[_agreementId];
        if(agreement.agreementStatus!=AgreementStatus.Finished){
            log("kontract bitmemis");
            if (agreement.agreementStatus==AgreementStatus.Continues){
                log("kontract dewamke");
                if (msg.sender==agreement.property.owner){
                    log("evsahibi beklemeye aldi");
                    agreement.agreementStatus=AgreementStatus.PendingByRenter;
                }
                if (msg.sender==agreement.hirer){
                    log("kiraci");
                    int timeDifference=int(agreement.endDate)-int(block.timestamp);
                    timeDifference= absoluteValue(timeDifference);
                    if (timeDifference>15 days && block.timestamp<agreement.endDate){
                        log("kiraci beklemeye aldi");
                        agreement.agreementStatus=AgreementStatus.PendingByHirer;
                    }
                    if((timeDifference<15 days && block.timestamp<agreement.endDate) || block.timestamp>agreement.endDate){
                        log("kiraci bitirdi");
                        agreement.agreementStatus=AgreementStatus.Finished;
                    }
            }
            }
            else{
                log("kontrat beklemede");
                if(agreement.agreementStatus==AgreementStatus.PendingByRenter){
                    log("ev sahibi kismi");
                    if(msg.sender==agreement.hirer){
                        log("kiraci imis");
                        agreement.agreementStatus=AgreementStatus.Finished;
                    }
                }
                if(agreement.agreementStatus==AgreementStatus.PendingByHirer){
                    log("kiraci kismi");
                    if(msg.sender==agreement.property.owner){
                        log("ev sahibi imis");
                        agreement.agreementStatus=AgreementStatus.Finished;
                    }
                }
            }
        }
        agreements[_agreementId]= agreement;
        emit SendReason(msg.sender,reason);

        //if devam ediyorsa
            //if renter, beklemeye al

            //if hirer,
                //if 15 önce
                    //beklemeye al

                //if15 sonra
                    //bitir
        //if beklemede
            //if renter
                //bitir
            
            //if hirer
                //bitir

    }

    function absoluteValue(int x) private pure returns (int) {
    if (x < 0) {
        return -x;
    } else {
        return x;
    }
}

    function sendReportToRenter(uint _agreementId,string memory subject,
     string memory message, SenderType senderType) isMemberOfAgreement public{
        Agreement memory agreement =agreements[_agreementId];
        require(msg.sender== agreement.hirer || msg.sender== agreement.property.owner,
        "To create a report, you must be a party to the relevant agreement");

        Report memory _report;
        _report.id=reportId;
        _report.createdDate=block.timestamp;
        _report.message=message;
        _report.agreement=agreement;
        _report.subject=subject;
        _report.senderType=senderType;

        emit SendReport(msg.sender,_report);
        reports.push(_report);
        reportId=reportId+1;
    }

    function punishRenter(address renterAddress) isAdmin public{
        suspendedRenters.push(renterAddress);
    }

    function punishHirer(address hirerAddress) isAdmin public{
        suspendedHirers.push(hirerAddress);
    }
}