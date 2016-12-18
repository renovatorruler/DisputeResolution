import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { VNode } from '@cycle/dom';
import { ISliderProps } from './LabeledSlider';

export interface ISources {
  DOM: DOMSource;
  props: Stream<ISliderProps>;
}

export interface ISinks {
  DOM: Stream<VNode>;
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


