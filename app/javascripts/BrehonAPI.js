class BrehonContract {
  constructor(artifact) {
    this.artifact = artifact;
    this.acceptContract = this.acceptContract;
    this.startContract = this.startContract;
    this.acceptSettlement = this.acceptSettlement;
    this.proposeSettlement = this.proposeSettlement;
    this.deposit = this.deposit;
    this.adjudicate = this.adjudicate;
    this.raiseDispute = this.raiseDispute;
    this.claimFunds = this.claimFunds;
    this.raiseAppeal = this.raiseAppeal;
    this.raise2ndAppeal = this.raise2ndAppeal;
  }

  deployed() {
    return new Promise(
      (resolve, reject) => {
        this.artifact.deployed()
          .then((instance) => {
            this.instance = instance;
            resolve(this);
          }).catch(reject);
      }
    );
  }

  acceptContract() {
    return this.instance.acceptContract(arguments);
  }

  acceptSettlement() {
    return this.instance.acceptSettlement(arguments);
  }

  deposit() {
    return this.instance.deposit(arguments)
  }

  startContract() {
    return this.instance.startContract(arguments);
  }

  raiseDispute() {
    return this.instance.raiseDispute(arguments);
  }

  adjudicate() {
    return this.instance.adjudicate(arguments);
  }

  claimFunds() {
    return this.instance.claimFunds(arguments);
  }

  raiseAppeal() {
    return this.instance.raiseAppeal(arguments);
  }

  raise2ndAppeal() {
    return this.instance.raise2ndAppeal(arguments);
  }

  proposeSettlement() {
    return this.instance.proposeSettlement(arguments);
  }
}

module.exports = BrehonContract;
