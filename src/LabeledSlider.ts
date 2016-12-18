import xs, { Stream, MemoryStream } from 'xstream';
import { div, label, input, VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { ISources } from './Interfaces';

export interface ISliderProps {
  label: string;
  unit: string;
  min: number;
  value: number;
  max: number;
}

export type Sources = {
  DOM: DOMSource,
  props$: Stream<ISliderProps>
}

export type Sinks = {
  DOM: Stream<VNode>,
  value$: MemoryStream<number>
}

function LabeledSlider(sources: Sources): Sinks  {
  const DOM = sources.DOM;
  const props$ = sources.props$;

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

  const sinks: Sinks = {
    DOM: vdom$,
    value$: state$.map(state => state.value)
  };

  return sinks;
}

export default LabeledSlider;
