"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var factory = function factory(Pudding) {
  // Inherit from Pudding. The dependency on Babel sucks, but it's
  // the easiest way to extend a Babel-based class. Note that the
  // resulting .js file does not have a dependency on Babel.

  var MetaCoin = (function (_Pudding) {
    _inherits(MetaCoin, _Pudding);

    function MetaCoin() {
      _classCallCheck(this, MetaCoin);

      _get(Object.getPrototypeOf(MetaCoin.prototype), "constructor", this).apply(this, arguments);
    }

    return MetaCoin;
  })(Pudding);

  ;

  // Set up specific data for this class.
  MetaCoin.abi = [{ "constant": false, "inputs": [{ "name": "receiver", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "sendCoin", "outputs": [{ "name": "sufficient", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [], "name": "makeAppeal", "outputs": [], "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "setArbitrator", "outputs": [], "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }, { "inputs": [], "type": "constructor" }];
  MetaCoin.binary = "60606040526000805460ff19169055600160a060020a03321660009081526003602052604090206127109055610119806100396000396000f3606060405260e060020a600035046390b98a11811461003c5780639de8e4b01461006b578063b0eefabe14610070578063f8b2cb4f146100ca575b005b6100e660043560243533600160a060020a0316600090815260036020526040812054829010156100f057610113565b61003a565b61003a600435806001600050600081548110156100025752507fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6805473ffffffffffffffffffffffffffffffffffffffff19169091179055565b600160a060020a03600435166000908152600360205260409020545b6060908152602090f35b604080822080548490039055600160a060020a0384168252902080548201905560015b9291505056";

  if ("0xa1dc0c3cf72de4e5a53ef0ec01fcf675ddfbddc5" != "") {
    MetaCoin.address = "0xa1dc0c3cf72de4e5a53ef0ec01fcf675ddfbddc5";

    // Backward compatibility; Deprecated.
    MetaCoin.deployed_address = "0xa1dc0c3cf72de4e5a53ef0ec01fcf675ddfbddc5";
  }

  MetaCoin.generated_with = "1.0.3";
  MetaCoin.contract_name = "MetaCoin";

  return MetaCoin;
};

// Nicety for Node.
factory.load = factory;

if (typeof module != "undefined") {
  module.exports = factory;
} else {
  // There will only be one version of Pudding in the browser,
  // and we can use that.
  window.MetaCoin = factory;
}