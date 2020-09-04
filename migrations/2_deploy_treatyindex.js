var TreatyIndex = artifacts.require("./TreatyIndex.sol");
var Treaty = artifacts.require("./Treaty.sol");
// var StringUtils = artifacts.require("./StringUtils.sol");

module.exports = async function (deployer) {
  // await deployer.deploy(StringUtils);
  deployer.deploy(Treaty, 123, "Test Treaty", "Details of Test Treaty");
  deployer.deploy(TreatyIndex, "A treaty index").then(() => {
    TreatyIndex.deployed().then((treatyIndex) => {
      deployer
        .deploy(Treaty, 1, "A treaty", "Some treaty text")
        .then((treaty) => {
          treatyIndex.addTreaty(treaty.address).then((tx) => {
            console.log(
              `Treaty with address ${treaty.address} deployed to TreatyIndex with name ${treatyIndex.address}`
            );
          });
        });
    });
  });
};
