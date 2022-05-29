# Crowdfunding dApp Project - Backend

This project builds upon an advanced sample Hardhat project template to create and test smart contracts for a decentralised crowdfunding application.

To spin up the frontend locally on your machine, you can find the repository [here](https://github.com/0xbagholder/crowdfund-frontend) with instruction.

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
    - Will have to submit a request to spend any money the crowdfunding campaign has raised (e.g. to pay for raw materials or suppliers etc.)
    - A request will only be approved for spending if >= 50% of the crowdfund's contributors approve.

- Approvers/Contributors

### CrowdfundFactory.sol

