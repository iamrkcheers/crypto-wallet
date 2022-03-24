const Migrations = artifacts.require("Migrations");
const DaiTokenMockThree = artifacts.require("DaiTokenMockThree"); // exposing the contract

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMockThree); // deploying the contract

  const tokenMock = await DaiTokenMockThree.deployed(); // getting a copy of the deployed token
  // const tokenMock = await DaiTokenMockThree.at(DaiTokenMock.address);
  await tokenMock.mint(
    "0x38A8E3A9EdCfC554f96C1f3660725E5105e4817B",
    "1000000000000000000000"
  ); // minting 1000 tokens
};
