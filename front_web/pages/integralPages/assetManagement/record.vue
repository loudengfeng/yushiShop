<template>
  <view class="content">
    <!-- 头部区域 -->
    <view class="common head">
      <view style="flex: 2">序号</view>
      <view style="flex: 1">金额</view>
      <view style="flex: 2">状态</view>
      <view style="flex: 2">申请时间</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 2">{{index + 1}}</view>
        <view style="flex: 1">{{item.Amount | numFilter}}</view>
        <view style="flex: 2"
              :class="item.IsCheck == -1 ? 'fails':''">{{item.IsCheck | IsCheck}}</view>
        <view style="flex: 2; line-height:1.4; font-size: 26rpx;">{{item.RequestTime}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      // 交易数据列表
      list: [],
      // 分页
      page: {
        // 当前页码
        pageIndex: 0,
        // 当前页面展示的数据条数
        pageSize: 20
      },
      // 数据总条数
      total: '',
      // 节流阀
      flag: true,
      // 底部的数据
      footerObj: ''
    };
  },
  onLoad () {
    // 查询提现记录接口
    this.getTransactionDetails()
  },
  // 监听页面滚动到底部的事件
  onReachBottom () {
    this.page.pageIndex += 1
    if (this.flag) {
      this.getTransactionDetails()
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  methods: {
    // 查询交易明细接口
    async getTransactionDetails () {
      let result = {}
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
        UserId: uni.getStorageSync('UserId')
      }
      result = JSON.stringify(result)
      let data = {
        action: 'ReadTiXian',
        data: result
      }
      let res = await this.$api.api.orderList(data)
      if (res.data.status == true) {
        this.total = res.data.sum
        this.flag = true
        this.list.push(...res.data.data);
        console.log(this.list)
        if (this.total == this.list.length) {
          this.flag = false
        }
      }
    }
  },
  filters: {
    // IsCheck 0 审核中 -1 驳回  成功
    IsCheck (val) {
      let result = ''
      if (val == 0) {
        return result = '审核中'
      }
      if (val == -1) {
        return result = '驳回'
      }
      if (val == 1) {
        return result = '已审核'
      }
      if (val == 2) {
        return result = '已发放'
      }
      if (val == 3) {
        return result = '发放异常'
      }
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
.head {
  position: fixed;
  width: 100%;
  background-color: #223041;
  > view {
    color: #fff;
  }
}
.head-copy {
  height: 80rpx;
}
.common {
  height: 80rpx;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  > view {
    text-align: center;
    width: 25%;
  }
}
.list-item {
  margin-bottom: 10rpx;
  background-color: #fff;
  .fails {
    color: #d65050;
  }
}
</style>