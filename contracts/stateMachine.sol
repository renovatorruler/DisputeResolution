pragma solidity ^0.4.2;

contract stateMachine {
  enum Stages {
    Negotiation,
    Execution,
    Dispute,
    Resolution,
    Appeal,
    Completed
  }

  Stages public stage = Stages.Negotiation;

  modifier atStage(Stages _stage) {
    if (stage != _stage) throw;
    _;
  }

  function nextStage() internal {
    stage = Stages(uint(stage) + 1);
  }
}

