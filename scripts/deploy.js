  // We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  //const rinkebyURL = hre.config.networks.rinkeby.url;
  //const rinkebyProvider = new hre.ethers.providers.JsonRpcProvider(rinkebyURL);

  //const wallet = new hre.ethers.Wallet(hre.config.networks.rinkeby.accounts[0], rinkebyProvider);

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());


  const Lottery = await hre.ethers.getContractFactory('NextMillionaire');

  const lottery = await Lottery.deploy();

  const deployedLottery = await lottery.deployed();

  // As an owner, start the lottery
  console.log('Starting Lottery at:', deployedLottery.address);

  await deployedLottery.startLottery();
}

// async function main() {
//   await deployLottery();
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });