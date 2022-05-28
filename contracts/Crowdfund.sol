// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdfund is Ownable {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool isComplete;
        uint256 approvalCount;
        mapping(address => bool) hasApproved;
    }

    uint256 public minimumContribution;
    uint256 public approversCount;
    uint256 public requestId;
    mapping(address => bool) public approvers;
    mapping(address => uint256) public approversContribution;
    mapping(uint256 => Request) public requests;

    constructor(uint256 _minAmount, address _manager) {
        minimumContribution = _minAmount;
        transferOwnership(_manager);
    }

    function manager() public view returns (address _manager) {
        _manager = owner();
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "You need to send more ETH!");

        if (approvers[msg.sender] == true) {
            approversContribution[msg.sender] += msg.value;
        } else {
            approversCount++;
            approvers[msg.sender] = true;
            approversContribution[msg.sender] += msg.value;
        }
    }

    function createRequest(
        string calldata _description,
        uint256 _value,
        address payable _recipient
    ) external onlyOwner {
        Request storage newRequest = requests[requestId];
        requestId++;

        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.isComplete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 _requestId) external {
        Request storage request = requests[_requestId];

        require(
            approvers[msg.sender],
            "You do not have permission to approve this request!"
        );
        require(request.value != 0, "This request does not exist!");
        require(
            !request.hasApproved[msg.sender],
            "You've already voted on this request!"
        );

        request.approvalCount++;
        request.hasApproved[msg.sender] = true;
    }

    function finaliseRequest(uint256 _requestId) external onlyOwner {
        Request storage request = requests[_requestId];

        require(request.approvalCount > (approversCount / 2));
        require(
            !request.isComplete,
            "This request has already been completed!"
        );

        request.isComplete = true;
        (bool success, ) = request.recipient.call{value: request.value}("");
        require(success, "Tx failed to send funds to recipient!");
    }

    function getSummary()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            address(this).balance,
            minimumContribution,
            requestId,
            approversCount,
            manager()
        );
    }

    receive() external payable {
        contribute();
    }
}
