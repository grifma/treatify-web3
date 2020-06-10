const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic =
  "width custom march box impact phrase fix steel eight urge surface enable";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: "./contracts",
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      network_id: "*",
      port: 8545,
    },
    truffleteams: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://sandbox.truffleteams.com/bf3cc750-eb8d-4868-a995-cb12353a9aef"
        );
      },
      network_id: 1591732848654,
    },
  },
  compilers: {
    solc: {
      version: "0.5.16",
      optimisation: false,
    },
  },
};
