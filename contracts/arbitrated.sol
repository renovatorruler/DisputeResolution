contract arbitrated {

    uint8 currentArbitrator = 0; 
    address [] arbitrators;
    bool isDisputed;
    modifier disputeLock() {
       if(msg.sender != arbitrators[currentArbitrator]) {
          throw;
       } 
    }

    function setArbitrator(address addr) {
        arbitrators[0] = addr;
    }

    function makeAppeal() {
    }
} 
