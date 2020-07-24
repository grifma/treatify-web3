var TreatyIndex = artifacts.require("TreatyIndex");
var Treaty = artifacts.require("Treaty");

contract("TreatyIndex", async (accounts) => {
  it("can deploy", async () => {
    let treatyIndex = await TreatyIndex.deployed();
    let name = await treatyIndex.indexName.call();
    assert.equal(name, "Coop's Australia", "Name not correct");
  });

  it("can add treaty", async () => {
    let treatyIndex = await TreatyIndex.deployed();
    let treaty = await Treaty.deployed();
    let tx = await treatyIndex.addTreaty(treaty.address);
    assert(tx != undefined, "no tx");
  });

  it("can get treaty address", async () => {
    let treatyIndex = await TreatyIndex.deployed();
    let treaty = await Treaty.deployed();
    let address = await treatyIndex.treatyIndex.call(0);
    assert.equal(address, treaty.address, "Address does not match");
  });

  it("can get treaty index", async () => {
    let treatyIndex = await TreatyIndex.deployed();
    let treaty = await Treaty.deployed();
    let index = await treatyIndex.getTreatyIndex.call();
    assert.equal(index[0], treaty.address, "Address does not match");
  });
});
