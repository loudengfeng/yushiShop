<template>
  <view class="common">
    <view v-if="number == 1 ? true : false">
      <view class="common-box weixin"
            v-for="(item, index) in weixinList"
            :key="index"
            @click="changeWeixinList(item.wId)">
        <view class="box-left">{{ item.text }}</view>
        <view class="box-right"></view>
      </view>
    </view>
    <view v-if="number == 2 ? true : false">
      <view class="common-box weixin"
            v-for="(item, index) in QqList"
            :key="index"
            @click="changeQqList(item.qId)">
        <view class="box-left">{{ item.text }}</view>
        <view class="box-right"></view>
      </view>
    </view>
    <view v-if="number == 3 ? true : false">
      <view class="common-box weixin"
            v-for="(item, index) in phoneList"
            :key="index"
            @click="changePhone(item.pId)">
        <view class="box-left">{{ item.text }}</view>
        <view class="box-right"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 联系客服的数据
      weixinList: [
        {
          wId: 1,
          text: '微信客服 1',
          code: '微信客服 1'
        },
        {
          wId: 2,
          text: '微信客服 2',
          code: '微信客服 2'
        },
        {
          wId: 3,
          text: '微信客服 3',
          code: '微信客服 3'
        }
      ],
      // QQ 客服
      QqList: [
        {
          qId: 1,
          text: 'QQ 客服 1',
          code: 'QQ 客服 1'
        },
        {
          qId: 2,
          text: 'QQ 客服 2',
          code: 'QQ 客服 2'
        },
        {
          qId: 3,
          text: 'QQ 客服 3',
          code: 'QQ 客服 3'
        }
      ],
      // 电话客服
      phoneList: [
        {
          pId: 1,
          text: '电话客服 1',
          code: '1'
        },
        {
          pId: 2,
          text: '电话客服 2',
          code: '2'
        }
      ],
      // 判断是微信客服、QQ客服、还是电话客服 1 微信客服 2 QQ客服 3 电话客服
      number: ''
    };
  },
  onLoad(options) {
    this.number = options.id
  },
  methods: {
    // 选择微信客服
    changeWeixinList(id) {
      var obj = this.weixinList.find(x => {
        return x.wId == id;
      });
      uni.showModal({
        title: obj.code,
        content: '点击赋值微信号',
        success: res => {
          if (res.confirm) {
            uni.setClipboardData({
              data: obj.code
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    // 选择 QQ 客服
    changeQqList(id) {
      var obj = this.QqList.find(x => {
        return x.qId == id;
      });
      uni.showModal({
        title: obj.code,
        content: '点击赋值QQ号',
        success: res => {
          if (res.confirm) {
            uni.setClipboardData({
              data: obj.code
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    // 选择电话客服
    changePhone(id) {
      var obj = this.QqList.find(x => {
        return x.qId == id;
      });
      console.log(obj)
      uni.makePhoneCall({
        phoneNumber: obj.code //仅为示例
      });
    }
  }
};
</script>
<style>
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss">
.common {
  margin-top: 20rpx;
  .common-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    .box-right {
      width: 20rpx;
      height: 20rpx;
      border-top: 1rpx solid #8a8a8a;
      border-right: 1rpx solid #8a8a8a;
      transform: rotate(45deg);
    }
  }
}
</style>
