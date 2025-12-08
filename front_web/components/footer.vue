<template>
  <view>
    <view class="footer">
      <view class="footer-list">
        <view>
          <view v-for="(itemIcon,iconIndex) in footerList"
                :key="iconIndex"
                style="line-height: 1.3;"
                @click="choose(iconIndex,itemIcon.url)">
            <image :src="itemIcon.checked? itemIcon.icon1 : itemIcon.icon"></image>
            <view>{{itemIcon.name}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isIphoneX: {
      type: Boolean,
      default: false
    },
    num: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      footerList: [{
        index: 0,
        icon: '/static/tab-home.png',
        icon1: '/static/tab-home-current.png',
        checked: false,
        name: '首页',
        url: '/pages/FishCurrency/index/index'
      },
      {
        index: 1,
        icon: '/static/list1 (4).png',
        icon1: '/static/list1 (5).png',
        checked: true,
        name: '交易',
        url: '/pages/FishCurrency/transaction/transaction'
      },
      {
        index: 2,
        icon: '/static/list1 (6).png',
        icon1: '/static/list1 (1).png',
        checked: false,
        name: '统计',
        url: '/pages/user/vipData'
      },
      {
        index: 3,
        icon: '/static/tab-cart.png',
        icon1: '/static/tab-cart-current.png',
        checked: false,
        name: '商城',
        url: '/pages/index/index'
      },
      {
        index: 4,
        icon: '/static/list1 (2).png',
        icon1: '/static/list1 (3).png',
        checked: false,
        name: '委托',
        url: '/pages/integralPages/OTCBusiness/index'
      }
      ]
    };
  },
  created() {
    for (var i in this.footerList) {
      var obj = this.footerList[i]
      obj.checked = this.num == i
    }
  },
  methods: {
    choose(index, url) {
      for (var i in this.footerList) {
        var obj = this.footerList[i]
        obj.checked = index == i
      }
      this.jump(index, url)
    },
    jump(index, url) {
      if (url) {
        if (index == 3) {
          uni.switchTab({
            url: url
          })
        } else {
          uni.reLaunch({
            url: url
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;

  .footer-list {
    > view {
      height: 100rpx;
      padding-top: 10rpx;
      width: 100%;
      background-color: #fff;
      border-top: 1rpx solid #eeeeee;
      display: flex;

      > view {
        flex: 1;
        // flex: 1;
        text-align: center;

        image {
          height: 44rpx;
          width: 44rpx;
        }

        view {
          font-size: 20rpx;
        }

        // .iconfont{
        //   font-size: 0.5rem;
        //   color: #C2C2C2;
        // }
        // .icon{
        //   color: #000000 !important;
        // }
      }
    }
  }
}
</style>
