import Vue from 'vue'
import App from './App'
import './plugins/lazyLoad/js/config.js'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
});
app.$mount()
