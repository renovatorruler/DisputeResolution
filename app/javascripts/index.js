import 'ace-css/css/ace.css';
import 'font-awesome/css/font-awesome.css';

import './../index.html';

import Elm from './../elm/Main.elm';

setTimeout(() => {
  const mountNode = document.getElementById('main');
  Elm.Main.embed(mountNode);
}, 0);
