<template>
  <view class="common">
    <view class="common-box weixin"
          v-for="(item, index) in contactList"
          :key="index"
          @click="clickContact(item.cId)">
      <view class="box-left">{{ item.text }}</view>
      <view class="box-right"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 联系客服的数据
      contactList: [
        {
          cId: 1,
          text: '微信客服',
          code: '微信客服'
        },
        {
          cId: 2,
          text: 'QQ客服',
          code: 'QQ客服'
        },
        {
          cId: 3,
          text: '电话客服',
          code: '电话客服'
        }
      ]
    };
  },
  methods: {
    clickContact(id) {
      uni.navigateTo({
        url: '/pages/product/serviceList/serviceList?id=' + id
      });
    },
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
