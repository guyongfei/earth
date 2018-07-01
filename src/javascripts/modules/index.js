/*
  Automatically instantiates modules based on data-attributes
  specifying module file-names.
*/

const moduleElements = document.querySelectorAll('[data-module]')
const modules = {}

for (var i = 0; i < moduleElements.length; i++) {
  const el = moduleElements[i]
  const name = el.getAttribute('data-module')
  const Module = require(`./${name}`).default
  modules[name] = new Module(el)
}

export default function getModule (name) {
  return modules[name]
}

/*
  Usage:
  ======

  html
  ----
  <button data-module="disappear">disappear!</button>

  js
  --
  // modules/disappear.js
  export default class Disappear {
    constructor(el) {
      el.style.display = 'none'
    }
  }
*/
