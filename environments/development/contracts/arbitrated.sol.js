"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var factory = function factory(Pudding) {
  // Inherit from Pudding. The dependency on Babel sucks, but it's
  // the easiest way to extend a Babel-based class. Note that the
  // resulting .js file does not have a dependency on Babel.

  var arbitrated = (function (_Pudding) {
    _inherits(arbitrated, _Pudding);

    function arbitrated() {
      _classCallCheck(this, arbitrated);

      _get(Object.getPrototypeOf(arbitrated.prototype), "constructor", this).apply(this, arguments);
    }

    return arbitrated;
  })(Pudding);

  ;

  // Set up specific data for this class.
  arbitrated.abi = [{ "constant": false, "inputs": [], "name": "makeAppeal", "outputs": [], "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "setArbitrator", "outputs": [], "type": "function" }];
  arbitrated.binary = "60606040526000805460ff191681556080908190601b90396000f3606060405260e060020a60003504639de8e4b081146024578063b0eefabe146028575b005b6022565b60226004358060016000506000815481101560025752507fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6805473ffffffffffffffffffffffffffffffffffffffff1916909117905556";

  if ("" != "") {
    arbitrated.address = "";

    // Backward compatibility; Deprecated.
    arbitrated.deployed_address = "";
  }

  arbitrated.generated_with = "1.0.3";
  arbitrated.contract_name = "arbitrated";

  return arbitrated;
};

// Nicety for Node.
factory.load = factory;

if (typeof module != "undefined") {
  module.exports = factory;
} else {
  // There will only be one version of Pudding in the browser,
  // and we can use that.
  window.arbitrated = factory;
}