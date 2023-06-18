const QrStore = artifacts.require("QrStore");

module.exports = function(deployer) {
  deployer.deploy(QrStore);
};
