import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import "./permission"
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor'
Vue.component('QuillEditor', quillEditor)

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// const apps = [
//   {
//     name: 'vueApp', // 应用的名字
//     entry: '//http://localhost:8080/#/', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
//     container: '#vue', // 容器名（此项目页面中定义的容器id，用于把对应的子应用放到此容器中）
//     activeRule: '/vue', // 激活的路径
//     props: { a: 1 }	// 传递的值（可选）
//   },
//   {
//     name: 'reactApp',
//     entry: '//localhost:20000', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
//     container: '#react',
//     activeRule: '/react',
//   }
// ]
// registerMicroApps(apps); // 注册应用
// start({
//   prefetch: false // 取消预加载
// });// 开启
