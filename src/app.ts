import { Stream } from 'xstream';
import { run } from '@cycle/xstream-run';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { div, input, h2, label, makeDOMDriver, VNode } from '@cycle/dom';
import { ISliderProps, ISources, ISinks, IComponentSinks, IState, IActions } from './Interfaces';

function renderSlider(props: ISliderProps) {
  return div('.labeled-slider', [
    label('.label', `${props.label} ${props.value} ${props.unit}`),
    input('.slider' + props.className, {
      attrs: {
        type: 'range',
        min: props.min,
        max: props.max
      }
    })
  ]);
}

function renderWeightSlider(weight: number) {
  return renderSlider({
    label: 'Weight',
    className: '.weight',
    unit: 'kg',
    min: 40,
    value: 70,
    max: 140
  });
}

function renderHeightSlider(height: number) {
  return renderSlider({
    label: 'Height',
    className: '.height',
    unit: 'cm',
    min: 140,
    value: 160,
    max: 240
  });
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


function LabeledSlider(sources: ISources): IComponentSinks  {
  const DOM = sources.DOM;
  const props$ = sources.props;

  const newValue$ = DOM
    .select('.slider')
    .events('input')
    .map(ev => +(ev.target as HTMLInputElement).value);

  const state$ = props$
    .map(props => newValue$
      .map(val => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        value: val,
        max: props.max
      }))
      .startWith(props)
    )
    .flatten()
    .remember();

  const vdom$ = state$
    .map(state =>
         div('.labeled-slider', [
           label('.label', `${state.label} ${state.value} ${state.unit}`),
           input('.slider', {
             attrs: {
               type: 'range',
               min: state.min,
               max: state.max
             }
           })
         ])
        );

  const sinks: IComponentSinks = {
    DOM: vdom$,
    value: state$.map(state => state.value)
  };

  return sinks;
}

function main(sources: ISources): ISinks {
  const props$ = Stream.of({
    label: 'Radius', className: '.radius', unit: '', min: 10, max: 100, value: 30
  });
  const childSources: ISources = {DOM: sources.DOM, props: props$};
  const labeledSlider: IComponentSinks = LabeledSlider(childSources);
  const childVDom$ = labeledSlider.DOM;
  const childValue$ = labeledSlider.value;

  const vdom$ = Stream.combine(childValue$, childVDom$)
    .map(([value, childVDom]) => 
         div([
           childVDom,
           div({style: {
             backgroundColor: '#58D338',
             width: String(2 * value) + 'px',
             height: String(2 * value) + 'px',
             borderRadius: String(value) + 'px'
           }})
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
