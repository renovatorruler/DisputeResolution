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

interface IState {
  weight: number,
  height: number,
  bmi: number
}

interface IActions {
  changeWeight$: Stream<number>,
  changeHeight$: Stream<number>,
}

function renderWeightSlider(weight: number) {
  return div([
    label('.weight-label', `Weight ${weight} kg`),
    input('.weight', {
      attrs: {
        type: 'range',
        min: 40,
        max: 140,
        name: 'weight'
      }
    }, 'Weight')
  ]);
}

function renderHeightSlider(height: number) {
  return div([
    label('.height-label', `Height ${height} cm`),
    input('.height', {
      attrs: {
        type: 'range',
        min: 140,
        max: 240,
        name: 'height'
      }
    }, 'Height')
  ]);
}

function bmi(weight: number, height: number) {
  const heightMeters = height * 0.01;
  const bmi = Math.round(weight / (heightMeters * heightMeters));
  return bmi;
}

function view(state$: Stream<IState>) {
  return state$.map(state =>
    div([
      renderHeightSlider(state.height),
      renderWeightSlider(state.weight),
      h2(`BMI is ${state.bmi}`)
    ])
  );
}

function model(actions: IActions): Stream<IState> {
  const weight$ = actions.changeWeight$.startWith(60);
  const height$ = actions.changeHeight$.startWith(170);

  return Stream.combine(weight$, height$)
    .map(([weight, height]) => {
      let state: IState = {
        weight,
        height,
        bmi: bmi(weight, height)
      };

      return state;
    });
}

function intent(DOM: DOMSource) {
  const changeWeight$ = DOM.select('.weight')
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);

  const changeHeight$ = DOM.select('.height')
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);

  return {changeWeight$, changeHeight$};
}


function main(sources: ISources): ISinks {
  const sinks: ISinks = {
    DOM: view(model(intent(sources.DOM)))
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app')
})

export default main;
