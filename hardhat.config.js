require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  const provider = ethers.provider;
  let counter = 0;

  for (const account of accounts) {
    const id = counter < 10 ? `0${counter}` : counter;
    const ethBalance = ethers.utils.formatEther(await provider.getBalance(account.address));
    console.log(`[${id}] ${account.address} -- ${ethBalance} ETH`);
    counter++;
  };
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
