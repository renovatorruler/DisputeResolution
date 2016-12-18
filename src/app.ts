import { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { div, input, h2, makeDOMDriver, VNode } from '@cycle/dom';

interface ISources {
    DOM: DOMSource;
}

interface ISinks {
    DOM: Stream<VNode>;
}

function main(sources: ISources) {
  const changeWeight$ = sources.DOM.select('.weight')
    .events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const changeHeight$ = sources.DOM.select('.height')
    .events('input')
    .map(ev => (ev.target as HTMLInputElement).value);


  const DOM = sources.DOM;

  const sinks: ISinks = {
    DOM: Stream.of(
      div([
        input('.height', {
          props: {
            type: 'range',
            name: 'height'
          }
        }, 'Height')
      ])
    )
  };
  
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app')
})

export default main;
