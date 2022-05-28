// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdfund.sol";

contract CrowdfundFactory {
    Crowdfund[] public deployedCrowdfunds;

    function createCrowdfund(uint256 _minAmount) external {
        Crowdfund crowdfund = new Crowdfund(_minAmount, msg.sender);
        deployedCrowdfunds.push(crowdfund);
    }

    function getDeployedCrowdfunds()
        external
        view
        returns (Crowdfund[] memory)
    {
        return deployedCrowdfunds;
    }
}
