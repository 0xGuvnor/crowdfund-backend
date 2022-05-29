# Crowdfunding dApp Project - Backend

This project builds upon an advanced sample Hardhat project template to create and test smart contracts for a decentralised crowdfunding application.

To spin up the frontend locally on your machine, you can find the repository [here](https://github.com/0xbagholder/crowdfund-frontend) with instructions.

## Getting Start

To start, clone this repository and install its dependencies:

```shell
git clone https://github.com/0xbagholder/crowdfund-backend.git
cd crowdfund-backend
npm install
```

## Overview of the Contracts

### Crowdfund.sol

2 Types of Users will be interacting with this contract:

- Crowdfund Manager
    - The address that deployed the contract and is seeking to raise funds for a product/project
    - Sets the minimum amount a user can contribute to the crowdfunding campaign (denominated in ETH)
    - Will have to submit a request to spend any money the crowdfunding campaign has raised (e.g. to pay for raw materials or suppliers etc)
    - A request will only be approved for spending if >= 50% of the crowdfund's contributors approve

- Approvers/Contributors
    - Any user that contributes an amount greater than or equal to the crowdfunding campaign's minimum contribution threshold
    - Will be able to vote to approve on the spending of raised funds as detailed by a request made by the crowdfund manager

### CrowdfundFactory.sol

Factory contract to deploy individual crowdfunding campaigns.

Users will be interacting with this contract on the [frontend](https://github.com/0xbagholder/crowdfund-frontend) to create a new crowdfunding campaign.