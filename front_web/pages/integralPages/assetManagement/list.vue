<template>
  <view>
    <view class="tab">
      <view v-for="(item, index) in tab"
            :key="index"
            @click="changeTab(item.id)"
            :class="current == item.id ? 'active':''">{{item.text}}</view>
    </view>
    <reflect v-if="current == 0"></reflect>
    <balance v-else></balance>
  </view>
</template>

<script>
import reflect from './reflect'
import balance from './balance'
export default {
  components: {
    reflect,
    balance
  },
  data () {
    return {
      tab: [
        {
          id: 0,
          text: '提现'
        },
        {
          id: 1,
          text: '转账'
        }
      ],
      // 默认选中项
      current: 0
    }
  },
  methods: {
    changeTab (id) {
      this.current = id
    }
  },
}
</script>

<style lang="scss">
.tab {
  display: flex;
  > view {
    width: 50%;
    font-size: 36rpx;
    color: #223041;
    font-weight: 600;
    text-align: center;
    border-bottom: 6rpx solid transparent;
  }
  .active {
    border-bottom: 6rpx solid #223041;
  }
}
</style>