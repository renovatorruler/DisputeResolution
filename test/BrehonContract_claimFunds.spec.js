const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const fastForwardTime = contractHelpers.fastForwardTime;
const assertError = contractHelpers.assertError;
const assertNoError = contractHelpers.assertNoError;
const assertNoErrorWithMsg = assertNoError(false, 'No Exception must be thrown');
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const verifyEvent = contractHelpers.verifyEvent;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
// const getSplitForTertiaryBrehon = contractHelpers.getPercentageSplit(defaults, 2);


/**
 * Spec:
 * + Must use verifyEvent method
 * + Error verification should happen via assertError
 * - Must check for all stages
 **/

contract('BrehonContract claimFunds should only be allowed at one of the conflict resolved stages', () => {
  it('by preventing it from being called at Negotiation stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyB_addr });
      })
      .catch(assertError('Exception was not thrown when claimFunds was triggered during the Negotiation state'));
  });
});

contract('BrehonContract claimFunds should only be allowed at one of the conflict resolved stages', () => {
  it('by preventing it from being called at Execution stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyB_addr });
      })
      .catch(assertError('Exception was not thrown when claimFunds was triggered during the Execution state'));
  });
});

contract('BrehonContract should allow partyA to be able to withdraw funds', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  const sufficientTime = 60 * 60 * 24 * 5;
  it('after appealPeriod', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.partyA_addr);
      })
      .catch(assertNoErrorWithMsg)
      .then(fastForwardTime(web3, sufficientTime))
      .catch(assertNoErrorWithMsg)
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyA_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.partyA_addr,
        amount: settlement.partyA,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.partyA_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.partyA).eq(newBalance));
      })
      .catch(assertNoErrorWithMsg);
  });
});

contract('BrehonContract should not allow partyA to be able to withdraw funds', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  const insufficientTime = 60 * 60 * 24 * 2;
  it('before appealPeriod', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(fastForwardTime(web3, insufficientTime))
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyA_addr });
      })
      .catch(assertError('Exception was not thrown when claimFunds was triggered before the appealPeriod was over'));
  });
});

contract('BrehonContract should allow partyB to be able to withdraw funds', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  const sufficientTime = 60 * 60 * 24 * 5;
  it('after appealPeriod', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.partyB_addr);
      })
      .catch(assertNoErrorWithMsg)
      .then(fastForwardTime(web3, sufficientTime))
      .catch(assertNoErrorWithMsg)
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyB_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.partyB_addr,
        amount: settlement.partyB,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.partyB_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.partyB).eq(newBalance));
      })
      .catch(assertNoErrorWithMsg);
  });
});

contract('BrehonContract should not allow partyB to be able to withdraw funds', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  const insufficientTime = 60 * 60 * 24 * 2;
  it('before appealPeriod', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(fastForwardTime(web3, insufficientTime))
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyB_addr });
      })
      .catch(assertError('Exception was not thrown when claimFunds was triggered before the appealPeriod was over'));
  });
});

contract('BrehonContract should allow partyA to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  it('at Execution stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.partyA_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyA_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.partyA_addr,
        amount: settlement.partyA,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.partyA_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.partyA).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow partyB to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(40),
    partyB: getSplitForPrimaryBrehon(60),
  };
  it('at Execution stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyB_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyB_addr))
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.partyB_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.partyB_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.partyB_addr,
        amount: settlement.partyB,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.partyB_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.partyB).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyB tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
    primaryBrehon: defaults.primaryBrehon_fixedFee,
    secondaryBrehon: defaults.secondaryBrehon_fixedFee,
    tertiaryBrehon: defaults.tertiaryBrehon_fixedFee,
  };
  it('at Execution stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
    primaryBrehon: new BigNumber(defaults.primaryBrehon_fixedFee)
      .add(new BigNumber(defaults.primaryBrehon_disputeFee)),
    secondaryBrehon: defaults.secondaryBrehon_fixedFee,
    tertiaryBrehon: defaults.tertiaryBrehon_fixedFee,
  };
  it('at Dispute stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
    primaryBrehon: new BigNumber(defaults.primaryBrehon_fixedFee)
      .add(new BigNumber(defaults.primaryBrehon_disputeFee)),
    secondaryBrehon: defaults.secondaryBrehon_fixedFee,
    tertiaryBrehon: defaults.tertiaryBrehon_fixedFee,
  };
  it('at AppealPeriod stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
    primaryBrehon: new BigNumber(defaults.primaryBrehon_fixedFee)
      .add(new BigNumber(defaults.primaryBrehon_disputeFee)),
    secondaryBrehon: new BigNumber(defaults.secondaryBrehon_fixedFee)
      .add(new BigNumber(defaults.secondaryBrehon_disputeFee)),
    tertiaryBrehon: defaults.tertiaryBrehon_fixedFee,
  };
  it('at Appeal stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoError(true, 'Exception was thrown during startContractAndRaiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during raiseAppeal'))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during proposeSettlement'))
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during acceptSettlement'))
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForSecondaryBrehon(60),
    partyB: getSplitForSecondaryBrehon(40),
    primaryBrehon: new BigNumber(defaults.primaryBrehon_fixedFee)
      .add(new BigNumber(defaults.primaryBrehon_disputeFee)),
    secondaryBrehon: new BigNumber(defaults.secondaryBrehon_fixedFee)
      .add(new BigNumber(defaults.secondaryBrehon_disputeFee)),
    tertiaryBrehon: new BigNumber(defaults.tertiaryBrehon_fixedFee),
  };
  it('at SecondAppealPeriod stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoError(true, 'Exception was thrown during startContractAndRaiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(60),
          getSplitForPrimaryBrehon(40),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during secondaryBrehon\'s adjudicate'))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during proposeSettlement'))
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during acceptSettlement'))
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow the Brehons to withdraw funds after a settlement', () => {
  const settlement = {
    partyA: getSplitForSecondaryBrehon(60),
    partyB: getSplitForSecondaryBrehon(40),
    primaryBrehon: new BigNumber(defaults.primaryBrehon_fixedFee)
      .add(new BigNumber(defaults.primaryBrehon_disputeFee)),
    secondaryBrehon: new BigNumber(defaults.secondaryBrehon_fixedFee)
      .add(new BigNumber(defaults.secondaryBrehon_disputeFee)),
    tertiaryBrehon: new BigNumber(defaults.tertiaryBrehon_fixedFee)
      .add(new BigNumber(defaults.tertiaryBrehon_disputeFee)),
  };
  it('at SecondAppeal stage', () => {
    let brehonContract;
    let startingBalance;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoError(true, 'Exception was thrown during startContractAndRaiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(60),
          getSplitForPrimaryBrehon(40),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during secondaryBrehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during raise2ndAppeal'))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during proposeSettlement'))
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoError(true, 'Exception was thrown during acceptSettlement'))
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.primaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.primaryBrehon_addr,
        amount: settlement.primaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.primaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(startingBalance.minus(gasPaid).plus(settlement.primaryBrehon).eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.secondaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.secondaryBrehon_addr,
        amount: settlement.secondaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.secondaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.secondaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when secondaryBrehon tried to accept settlement');
      })
      .then(() => {
        startingBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
      })
      .then(function claimFunds() {
        return brehonContract.claimFunds({ from: defaults.tertiaryBrehon_addr });
      })
      .then(verifyEvent('FundsClaimed', {
        claimingParty: defaults.tertiaryBrehon_addr,
        amount: settlement.tertiaryBrehon,
      }))
      .then((result) => {
        const newBalance = web3.eth.getBalance(defaults.tertiaryBrehon_addr);
        const tx = web3.eth.getTransaction(result.tx);
        const block = web3.eth.getBlock(tx.blockNumber);
        const gasPaid = new BigNumber(block.gasUsed).mul(tx.gasPrice);
        assert.isTrue(
          startingBalance
          .minus(gasPaid)
          .plus(settlement.tertiaryBrehon)
          .eq(newBalance));
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to accept settlement');
      });
  });
});
