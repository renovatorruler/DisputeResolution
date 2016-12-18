import { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { DOMSource } from '@cycle/dom/xstream-typings';
import isolate from '@cycle/isolate';
import { div, input, h2, label, makeDOMDriver, VNode } from '@cycle/dom';
import { ISources, ISinks, IState, IActions } from './Interfaces';
import LabeledSlider, { ISliderProps, Sources, Sinks } from './LabeledSlider';

function bmi(weight: number, height: number) {
  const heightMeters = height * 0.01;
  const bmi = Math.round(weight / (heightMeters * heightMeters));
  return bmi;
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

function getSliderEvent(DOM: DOMSource, selector: string) {
  return DOM.select('.' + selector)
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);
}

function intent(DOM: DOMSource) {
  return {
    changeWeight$: getSliderEvent(DOM, 'weight'),
    changeHeight$: getSliderEvent(DOM, 'height')
  };
}


function main(sources: ISources): ISinks {
  const weightProps$ = Stream.of({
    label: 'Weight', unit: '', min: 40, max: 170, value: 70
  });
  const heightProps$ = Stream.of({
    label: 'Height', unit: '', min: 140, max: 220, value: 160
  });

  const weightSources: Sources = { DOM: sources.DOM, props$: weightProps$ };
  const heightSources: Sources = { DOM: sources.DOM, props$: heightProps$ };

  const WeightSlider = isolate(LabeledSlider)(weightSources);
  const HeightSlider = isolate(LabeledSlider)(heightSources);

  const weightVDom$ = WeightSlider.DOM;
  const weightValue$ = WeightSlider.value;

  const heightVDom$ = HeightSlider.DOM;
  const heightValue$ = HeightSlider.value;

  const bmi$ = Stream.combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      return bmi(+weight, +height);
    })
    .remember();

  const vdom$ = Stream.combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
         div([
           weightVDom,
           heightVDom,
           h2(`BMI is ${bmi}`)
         ])
        );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver('#app')
})

export default main;
