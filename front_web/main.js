import Vue from 'vue'
import store from './store'
import App from './App'
import api from '@/common/js/http'
import status from '@/common/js/consts'
import _config from '@/common/js/config'
import _util from '@/common/js/util'
import _debounce from '@/common/js/debounce'
import json from './Json.js'
import BaseBlank from './components/BaseBlank/BaseBlank.vue'
Vue.use(BaseBlank)
// 剪切板
import 'ican-H5Api'
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
// 保留当前数据到小数点后两位
Vue.filter('numFilter', (value) => {
	// console.log(val)
	let realVal = '';
	if (!isNaN(value) && value != '') {
		// 截取当前数据到小数点后两位
		realVal = parseFloat(value).toFixed(2);
	} else {
		realVal = '--';
	}
	return realVal;
})
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false

Vue.prototype.$fire = new Vue();

Vue.prototype.$store = store;

Vue.prototype.$api = {
	api,
	msg,
	json
}

_debounce
Vue.prototype.$debounce = _debounce
Vue.prototype.$config = _config

Vue.prototype.$status = status

Vue.prototype.$util = _util


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()