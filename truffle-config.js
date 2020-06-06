const path = require("path");

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
  },
  compilers: {
    solc: {
      version: "0.5.16",
      optimisation: false,
    },
  },
};
