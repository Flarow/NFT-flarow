const NFT_market = artifacts.require("NFT_market");
const NFT_creation = artifacts.require("NFT_creation");

module.exports = async function (deployer) {
  await deployer.deploy(NFT_market);
  const a=await NFT_market.deployed();
  deployer.deploy(NFT_creation,a.address);
};
