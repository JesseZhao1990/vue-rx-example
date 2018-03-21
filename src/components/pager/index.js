import pager from './src/pager'

pager.install = function (Vue) {
  Vue.component(pager.name, pager)
}

export default pager
