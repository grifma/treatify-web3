const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic =
  "width custom march box impact phrase fix steel eight urge surface enable";

module.exports = {
  contracts_directory: "./contracts",
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      network_id: "*",
      port: 8545,
    },
    devvps: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "http://161.97.97.238:8547",
          0,
          1
        );
      },
      network_id: "*",
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
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://kovan.infura.io/v3/59a5693a05d64fb7936b6c7f4b056f0c"
        );
      },
      network_id: 42,
    },
  },
  compilers: {
    solc: {
      version: "0.5.17",
      optimisation: false,
    },
  },
};
