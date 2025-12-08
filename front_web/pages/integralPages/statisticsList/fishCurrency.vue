<template>
  <view class="content">
    <!-- 头部区域 -->
    <view class="common head">
      <view style="flex: 2">ID</view>
      <view style="flex: 1">状态</view>
      <view style="flex: 2">数量</view>
      <view style="flex: 2">单价(元)</view>
      <view style="flex: 2">日期</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 2">{{item.FishRecordId}}</view>
        <view style="flex: 1">{{item.TransactionType}}</view>
        <view style="flex: 2">{{item.FishNumber}}</view>
        <view style="flex: 2">{{item.FishPrice | numFilter}}</view>
        <view style="flex: 2">{{item.CreateDate}}</view>
      </view>
    </view>
    <view class="footer-copy"></view>
    <view class="footer">
      <view class="f-l">统计
        <text class="today">今日</text>
      </view>
      <view class="f-r">
        <view>卖出 (个): {{footerObj.incomeFishNumber}}</view>
        <view>买入 (个) : {{footerObj.outputFishNumber}}</view>
        <view>总数量 (个) : {{footerObj.sumFishNumber}}</view>
        <view>总余额 (元) : {{footerObj.sumBalance | numFilter}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
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
  onLoad() {
    // 查询交易明细接口
    this.getTransactionDetails()
  },
  filters: {
    numFilter(value) {
      let realVal = '';
      if (!isNaN(value) && value != '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2);
      } else {
        realVal = '--';
      }
      return realVal;
    },
    numFilters(value) {
      let realVal = '';
      if (!isNaN(value) && value != '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(0);
      } else {
        realVal = '--';
      }
      return realVal;
    },
  },
  // 监听页面滚动到底部的事件
  onReachBottom() {
    this.page.pageIndex += 1
    if (this.flag) {
      this.getTransactionDetails()
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  methods: {
    // 查询交易明细接口
    async getTransactionDetails() {
      let result = {}
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize
      }
      result = JSON.stringify(result)
      let data = {
        action: 'ReadFishOrderRecord',
        data: result
      }
      let res = await this.$api.api.transactionDetails(data)
      console.log(res)
      if (res.data.status == true) {
        res.data.data.forEach(item => {
          item.Balance = Number(item.Balance).toFixed(2)
          // item.FishNumber = Number(item.FishNumber).toFixed(2)
          // item.FishPrice = Number(item.FishPrice).toFixed(2)
          item.CreateDate = item.CreateDate.split(' ')[0]
          if (item.TransactionType == true) {
            item.TransactionType = '买入'
          } else {
            item.TransactionType = '卖出'
          }
        })
        this.list.push(...res.data.data)
        this.total = res.data.sum[0].count
        res.data.sum.forEach(item => {
          if (item.outputFishNumber == '') {
            item.outputFishNumber = 0
          }
          if (item.incomeFishNumber == '') {
            item.incomeFishNumber = 0
          }
          if (item.sumFishNumber == '') {
            item.sumFishNumber = 0
          }
          if (item.sumBalance == '') {
            item.sumBalance = 0
          }
        })
        this.footerObj = res.data.sum[0]
        this.flag = true
        if (this.total == this.list.length) {
          this.flag = false
        }
      }
    }
  },
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
  background-color: #dfa15a;
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
}
.footer-copy {
  height: 350rpx;
}
.footer {
  position: fixed;
  bottom: 0rpx;
  display: flex;
  width: 100%;
  align-items: center;
  z-index: 22;
  padding: 20rpx 0;
  border-top: 1rpx solid #f5f5f5;
  background-color: #fff;
  .f-l {
    display: flex;
    flex-direction: column;
    border-right: 1rpx solid #d7d7d7;
    padding: 20rpx;
    color: #dfa15a;
    // font-size: 40rpx;
    // width: 150rpx;
    // height: 110rpx;
    // text-align: center;
  }
  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }
  .f-r view {
    font-size: 24rpx;
    margin-left: 30rpx;
    color: #dfa15a;
    padding: 10rpx;
    margin-bottom: 10rpx;
    background: rgba(250, 245, 241, 1);
    border-radius: 46rpx;
  }
  .f-f {
    margin-top: 20rpx;
  }
}
</style>