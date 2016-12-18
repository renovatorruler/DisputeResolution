import "mocha";
import { Stream } from 'xstream';
import { expect } from 'chai';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { ISources } from '../src/Interfaces';
import main from '../src/app';

describe('Main', () => {
  let sinks:any;
  let sources: ISources;
  let DOM: DOMSource;
  beforeEach(() => {
    sources = {
      DOM: DOM,
      props: Stream.of({
        label: 'Weight', className: '.weight', unit: 'kg', min: 40, value: 70, max: 100
      })
    };
    sinks = main(sources);
  });
  it('should return sinks', () => {
    expect(sinks.DOM).to.exist;
  });
});
