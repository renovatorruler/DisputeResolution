import "mocha";
import { expect } from "chai";
import main from '../src/app'

describe('Main', () => {
  it('should return sinks', () => {
    expect([1,2,3].indexOf(4)).to.equal(-1);
  });
});
