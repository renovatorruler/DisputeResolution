import contract from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import BrehonContractArtifact from '../../build/contracts/BrehonContract.json';

export default class BrehonAPI {
  constructor(web3provider) {
    // BrehonContract is our usable abstraction, which we'll use through the code below.
    this.brehonContract = contract(BrehonContractArtifact);

    // Bootstrap the BrehonContract abstraction for Use.
    this.brehonContract.setProvider(web3provider);
  }

  start() {
    console.info('started');
    return this;
  }
}
