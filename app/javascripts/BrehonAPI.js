import contract from 'truffle-contract';
import R from 'ramda';

// Import our contract artifacts and turn them into usable abstractions.
import BrehonContractArtifact from '../../build/contracts/BrehonContract.json';
import { PartyStruct, BrehonStruct, ResolutionStruct, UninitializedResolution } from '../../lib/contractHelpers';

export default class BrehonAPI {
  constructor(web3provider) {
    // BrehonContract is our usable abstraction, which we'll use through the code below.
    this.brehonContract = contract(BrehonContractArtifact);

    // Bootstrap the BrehonContract abstraction for Use.
    this.brehonContract.setProvider(web3provider);
  }

  getDeployed() {
    return this.brehonContract.deployed()
      .then((instance) => {
        this.instance = instance;
        this.address = instance.address;
        return this;
      });
  }

  getPartyA() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.partyA.call().then(partyA => ({
          addr: partyA[PartyStruct.addr],
          deposit: partyA[PartyStruct.deposit],
          contractAccepted: partyA[PartyStruct.contractAccepted],
        })));
  }

  getPartyB() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.partyB.call().then(partyB => ({
          addr: partyB[PartyStruct.addr],
          deposit: partyB[PartyStruct.deposit],
          contractAccepted: partyB[PartyStruct.contractAccepted],
        })));
  }

  getPrimaryBrehon() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.primaryBrehon.call().then(primaryBrehon => ({
          addr: primaryBrehon[BrehonStruct.addr],
          contractAccepted: primaryBrehon[BrehonStruct.contractAccepted],
          fixedFee: primaryBrehon[BrehonStruct.fixedFee],
          disputeFee: primaryBrehon[BrehonStruct.disputeFee],
        })));
  }

  getSecondaryBrehon() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.secondaryBrehon.call().then(secondaryBrehon => ({
          addr: secondaryBrehon[BrehonStruct.addr],
          contractAccepted: secondaryBrehon[BrehonStruct.contractAccepted],
          fixedFee: secondaryBrehon[BrehonStruct.fixedFee],
          disputeFee: secondaryBrehon[BrehonStruct.disputeFee],
        })));
  }

  getTertiaryBrehon() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.tertiaryBrehon.call().then(tertiaryBrehon => ({
          addr: tertiaryBrehon[BrehonStruct.addr],
          contractAccepted: tertiaryBrehon[BrehonStruct.contractAccepted],
          fixedFee: tertiaryBrehon[BrehonStruct.fixedFee],
          disputeFee: tertiaryBrehon[BrehonStruct.disputeFee],
        })));
  }

  acceptContract(addr) {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.acceptContract({ from: addr }));
  }

  depositFunds(addr, amount) {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.deposit({ from: addr, value: amount }));
  }

  getStage() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.stage.call());
  }

  getTransactionAmount() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.transactionAmount.call());
  }

  startContract(addr) {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.startContract({ from: addr }));
  }

  proposeSettlement(addr, awardPartyA, awardPartyB) {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.proposeSettlement(awardPartyA, awardPartyB, { from: addr }));
  }

  acceptSettlement(addr, awardPartyA, awardPartyB) {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.acceptSettlement(awardPartyA, awardPartyB, { from: addr }));
  }

  getProposedSettlement() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.proposedSettlement.call()
        .then((proposedSettlement) => {
          if (R.equals(UninitializedResolution, proposedSettlement)) {
            return null;
          }
          return R.zipObj(['proposingPartyAddr', 'settlementPartyA', 'settlementPartyB'], [
            proposedSettlement[ResolutionStruct.proposerAddr],
            proposedSettlement[ResolutionStruct.awardPartyA].valueOf(),
            proposedSettlement[ResolutionStruct.awardPartyB].valueOf(),
          ]);
        }));
  }

  getAllEvents(callback) {
    this.brehonContract.deployed()
      .then(instance =>
        instance.allEvents({ fromBlock: 0, toBlock: 'latest' }, callback));
  }

  getMinimumContractAmt() {
    return this.brehonContract.deployed()
      .then(instance =>
        instance.minimumContractAmt.call());
  }

  raiseDispute(addr) {
    return this.brehonContract.deployed()
    .then(instance =>
      instance.raiseDispute({ from: addr }));
  }

  withdrawFunds(addr) {
    return this.brehonContract.deployed()
    .then(instance =>
      instance.claimFunds({ from: addr }));
  }
}
