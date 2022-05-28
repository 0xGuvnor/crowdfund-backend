const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfund Contract", () => {
  let Crowdfund, crowdfund, manager, acc1, acc2, accs;

  beforeEach(async () => {
    [manager, acc1, acc2, ...accs] = await ethers.getSigners();
    Crowdfund = await ethers.getContractFactory("Crowdfund");
    crowdfund = await Crowdfund.deploy(ethers.utils.parseEther("0.01"), manager.address);
    await crowdfund.deployed();
  });

  describe("Contributions", () => {
    it("Should require a minimum contribution", async () => {
      await expect(crowdfund.contribute({ value: 1 })).to.be.revertedWith("You need to send more ETH!");
    });
  });

  describe("Requests", () => {
    it("Should only allow the manager to create a new request", async () => {
      const requestId = await crowdfund.requestId();

      await crowdfund.createRequest("test request", 10, accs[0].address);

      expect(await crowdfund.requestId()).to.equal(requestId + 1);
      expect((await crowdfund.requests(requestId)).description).to.equal("test request");

      await expect(
        crowdfund.connect(acc1).createRequest("test", 10, accs[0].address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow approvers to approve a request", async () => {
      const requestId = await crowdfund.requestId();
      await crowdfund.createRequest("test", 10, accs[0].address);
      await crowdfund.connect(acc1).contribute({ value: ethers.utils.parseEther("1") });

      expect(await crowdfund.approvers(acc1.address)).to.equal(true);

      const approvalCount = (await crowdfund.requests(requestId)).approvalCount;

      await crowdfund.connect(acc1).approveRequest(requestId);

      expect((await crowdfund.requests(requestId)).approvalCount).to.equal((parseInt(approvalCount) + 1).toString());
    });

    it("Should allow the manager to finalise a request", async () => {
      const provider = ethers.provider;
      const initialBal = await provider.getBalance(acc2.address);

      await crowdfund.createRequest("Buy supplies", ethers.utils.parseEther("1"), acc2.address);
      await crowdfund.connect(acc1).contribute({ value: ethers.utils.parseEther("2") });
      await crowdfund.connect(acc1).approveRequest(0);
      await crowdfund.finaliseRequest(0);

      expect(parseInt(await provider.getBalance(acc2.address)))
        .to.be.greaterThan(
          parseInt(initialBal.add(ethers.utils.parseEther("0.9"))));
    });
  });
});

describe("Crowfund Factory Contract", () => {
  let Factory, factory, acc1, acc2, acc3, crowdfund1, crowdfund2, crowdfund1Addr, crowdfund2Addr;

  beforeEach(async () => {
    [acc1, acc2, acc3] = await ethers.getSigners();
    Factory = await ethers.getContractFactory("CrowdfundFactory");
    factory = await Factory.deploy();
    await factory.deployed();
  });

  it("Should allow users to create a Crowdfund contract from the factory", async () => {
    const numOfDeployedContracts = (await factory.getDeployedCrowdfunds()).length;

    await factory.createCrowdfund(ethers.utils.parseEther("0.1"));
    await factory.connect(acc2).createCrowdfund(ethers.utils.parseEther("0.5"));
    await factory.connect(acc3).createCrowdfund(ethers.utils.parseEther("1"));

    expect((await factory.getDeployedCrowdfunds()).length).to.equal(numOfDeployedContracts + 3);
  });

  it("Should assign caller as the manager of the Crowdfund contract", async () => {
    await factory.createCrowdfund(ethers.utils.parseEther("0.1"));
    await factory.connect(acc2).createCrowdfund(ethers.utils.parseEther("0.5"));

    [crowdfund1Addr, crowdfund2Addr] = await factory.getDeployedCrowdfunds();

    crowdfund1 = await ethers.getContractAt("Crowdfund", crowdfund1Addr);
    crowdfund2 = await ethers.getContractAt("Crowdfund", crowdfund2Addr);

    expect(await crowdfund1.manager()).to.equal(acc1.address);
    expect(await crowdfund2.manager()).to.equal(acc2.address);
  });

  it("Should return a list of deployed Crowdfund contracts", async () => {
    await factory.createCrowdfund(ethers.utils.parseEther("1"));
    await factory.connect(acc1).createCrowdfund(ethers.utils.parseEther("2"));
    await factory.connect(acc2).createCrowdfund(ethers.utils.parseEther("3"));

    const deployedContracts = await factory.getDeployedCrowdfunds();

    expect(typeof deployedContracts).to.equal("object");
    expect(deployedContracts.length).to.equal(3);
  });
});
