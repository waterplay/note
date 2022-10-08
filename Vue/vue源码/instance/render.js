/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\instance\render.js
 */

import { installRenderHelpers } from './render-helpers'
import {nextTick} from './util/next-tick'

export function renderMixin(Vue) {

  installRenderHelpers(Vue)
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    let vnode = render.call(vm)
    return vnode
  }

  // todo 全局添加$nextTick 方法
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  }
}