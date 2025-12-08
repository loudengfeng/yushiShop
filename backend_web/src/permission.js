import { Message } from 'element-ui'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })
let wihteList=[];

// function dealRouter (routerList){
//   for(let i = 0 ; i < routerList.length; i++){
//     if(routerList[i].children){
//       dealRouter(routerList[i].children)
//     }
//     wihteList.push(routerList[i].path)
//   }
// }
// dealRouter(router.options.routes)

router.beforeEach((to, from, next) => {
  // router.options.routes.forEach((itemRouter) => {
  //   wihteList.push(itemRouter.path)
  //   if(itemRouter.children){
  //     itemRouter.children.forEach.forEach((childrenItemRouter) => {
  //       wihteList
  //     })
  //   }
  // })
  NProgress.start()
  if(localStorage.getItem('token')){
    next()
  }else{
    if(to.path === "/login"){
      next()
    }else {
      next('/login')
    }
  }
  // if(to.path === "/login"){
  //   next()
  // }else{
  //   next()
    // if(!getToken()){
    //   next('/login')
    // }else{
    //   if(!wihteList.includes(to.path)){
    //     next('/404')
    //   }
    //   next()
    // }
  // }
})
//
router.afterEach(() => {
  NProgress.done()
})
