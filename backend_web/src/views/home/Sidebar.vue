<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#343a49"
      text-color="#bfcbd9"
      active-text-color="#66B98D"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" class="iconfont"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index"> {{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }} </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon" class="iconfont"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from './bus';
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'icon-renshu',
          index: 'user',
          title: '用户管理'
        },
        {
          icon: 'icon-yonghu',
          index: 'checkUser',
          title: '用户审核'
        },
        {
          icon: 'icon-shangpinguanli',
          index: 'shopManagement',
          title: '商品管理',
          subs:[
            {
              index:'shopManagement',
              title:'商品管理'
            }
          ]
        },
        {
          icon: 'icon-dingdanguanli',
          index: 'order',
          title: '订单管理',
          subs:[
            {
              index:'order',
              title:'全部订单'
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  },
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
  .iconfont{
    font-size: 16px;
    margin-right: 5px;
  }
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
  background-color: #343a49 !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background-color: #66b98d !important;
}
</style>
