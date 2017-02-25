const BrehonContractArtifact = artifacts.require('./BrehonContract.sol');

class BrehonContract {
  constructor() {
    this.artifact = BrehonContractArtifact;
    this.acceptContract = this.acceptContract;
  }

  deployed() {
    return Promise.resolve(this);
    //return new Promise(
      //(resolve, reject) => {
        //this.artifact.deployed()
          //then((instance) => {
            //this.instance = instance;
            //resolve(this);
          //});
      //}
    //);
  }

  acceptContract() {
    return Promise.resolve(this.instance.acceptContract(arguments));
  }

  deposit() {
    return Promise.resolve(this.instance.deposit(arguments));
  }

  startContract() {
    return Promise.resolve(this.instance.startContract(arguments));
  }

  raiseDispute() {
    return Promise.resolve(this.instance.raiseDispute(arguments));
  }

  adjudicate() {
    return Promise.resolve(this.instance.adjudicate(arguments));
  }

  claimFunds() {
    return Promise.resolve(this.instance.claimFunds(arguments));
  }

  raiseAppeal() {
    return Promise.resolve(this.instance.raiseAppeal(arguments));
  }

  raise2ndAppeal() {
    return Promise.resolve(this.instance.raise2ndAppeal(arguments));
  }

  proposeSettlemendt() {
    return Promise.resolve(this.instance.proposeSettlement(arguments));
  }
}

module.exports = new BrehonContract();
