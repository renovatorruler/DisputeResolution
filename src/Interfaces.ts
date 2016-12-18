import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { VNode } from '@cycle/dom';

export interface ISliderProps {
  label: string,
  className: string,
  unit: string,
  min: number,
  value: number,
  max: number
}

export interface ISources {
  DOM: DOMSource;
  props: Stream<ISliderProps>;
}

export interface ISinks {
  DOM: Stream<VNode>;
}

export interface IComponentSinks {
  DOM: Stream<VNode>;
  value: Stream<number>;
}

export interface IState {
  weight: number,
  height: number,
  bmi: number
}

export interface IActions {
  changeWeight$: Stream<number>,
  changeHeight$: Stream<number>,
}


