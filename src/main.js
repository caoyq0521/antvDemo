import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import tanmaDesign from 'tanma-design';
import 'tanma-design/lib/index.less';

import { v4 as $uuid } from 'uuid';
Vue.prototype.$uuid = $uuid

Vue.use(tanmaDesign);
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
