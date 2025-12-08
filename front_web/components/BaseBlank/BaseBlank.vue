<template>
  <view class="no-search">
    <image src="/static/no-search.png"></image>
    <view>暂无数据</view>
  </view>
</template>

<style lang="scss">
.no-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rpx 0;
  padding: 30rpx;
  > image {
    width: 286rpx;
    height: 300rpx;
  }
}
</style>