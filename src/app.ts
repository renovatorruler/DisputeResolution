import { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { div, input, h2, label, makeDOMDriver, VNode } from '@cycle/dom';

interface ISources {
    DOM: DOMSource;
}

interface ISinks {
    DOM: Stream<VNode>;
}

function main(sources: ISources) {
  const changeWeight$ = sources.DOM.select('.weight')
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);

  const changeHeight$ = sources.DOM.select('.height')
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);

  const weight$ = changeWeight$.startWith(60);
  const height$ = changeHeight$.startWith(170);

  const state$ = Stream.combine(weight$, height$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return {weight, height, bmi};
    });

  const DOM = sources.DOM;

  const sinks: ISinks = {
    DOM: state$.map(state =>
      div([
        div([
          label('.height-label', `Height ${state.height} cm`),
          input('.height', {
            attrs: {
              type: 'range',
              min: 140,
              max: 240,
              name: 'height'
            }
          }, 'Height')
        ]),
        div([
          label('.weight-label', `Weight ${state.weight} kg`),
          input('.weight', {
            attrs: {
              type: 'range',
              min: 40,
              max: 140,
              name: 'weight'
            }
          }, 'Weight')
        ]),
        h2(`BMI is ${state.bmi}`)
      ])
    )
  };
  
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app')
})
