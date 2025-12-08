<template>
  <view>
    <view class="order-item" v-for="(item,index) in evaluateList" :key='index' @click="jump(item.OrderId)">
     <view v-for="(itemlist,indexlist) in item.LineItemsList" :key='indexlist'>
		 <view class="i-top b-b">
		   <text class="time">订单编号：{{itemlist.OrderID}}</text>
		   <!-- <text class="state">已完成</text> -->
		 </view>
		 <view class="goods-box w">
		   <view class="goods-box">
		     <view class="goods-item">
		       <image class="goods-img"
		              :src="itemlist.ThumbnailsUrl"
		              mode="aspectFill"></image>
		     </view>
		     <view class="right">
		       <view class="title">{{itemlist.ItemDescription}}</view>
		       <!-- <view>dfdfdfdfdfdfdfddf</view> -->
		     </view>
		   </view>
		   <view class="price-box" v-if="itemlist.OrderItemsStatus == 9">
		     <button class="action-btn recom">退货中</button>
		   </view>
		 		<view class="price-box" v-if="itemlist.OrderItemsStatus == 10">
		 		  <button class="action-btn recom">已退货成功</button>
		 		</view>
		 </view>
	 </view>

      <!-- <view class="price-box">
        <button class="action-btn recom"
                @click="jump(item)">评价</button>
      </view> -->
    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  data() {
    return {
      evaluateList: [],
      loadingType: 'more',
      start: 0,
      total: null,
      status: ''
    };
  },
  onLoad(option) {
    let status = option.state
    this.status = status
    let title = option.title;
    uni.setNavigationBarTitle({
      title
    })
    this.getEvaluate(status)
  },
  //加载更多
  onReachBottom() {
    this.getEvaluate(this.status);
  },
  methods: {
    // 跳转
    jump(id) {
		uni.navigateTo({
			url:'/pages/order/orderDetail?orderId='+id
		})
    },
    async getEvaluate(status) {
      if (this.total <= this.start && this.start != 0) {
        return
      }
      let param = {
        OrderStatus: status,
        PageIndex: Math.ceil(this.start / 10) == 0 ? "1" : Math.ceil(this.start / 10) + 1,
        action: 'GetOrderListByPage',
        PageSize: 10,
		OrderItemsStatus:'',
		OrderItemID:'6,7,8,9,10'
      }
      let res = await this.$api.api.orderList(param)
      if (res.data.status == true) {
        console.log(res)
        let result = res.data.Data
        result.forEach((item, index) => {
          item.LineItemsList.forEach((itemList, indexList) => {
            itemList.ThumbnailsUrl = this.$config.domain.api + itemList.ThumbnailsUrl
          })
        })
        this.total = res.data.RowsCount
        this.start += result.length
        this.loadingType = this.total > this.start ? "more" : "nomore"
        this.evaluateList = this.evaluateList.concat(result)
		console.log(this.evaluateList )
      }
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss">
.order-item {
  display: flex;
  flex-direction: column;
  margin-top: 16upx;

  .i-top {
    display: flex;
    align-items: center;
    height: 80upx;
    padding-left: 30upx;
    font-size: $font-base;
    color: $font-color-dark;
    position: relative;
    background-color: #fff;

    .time {
      flex: 1;
    }

    .state {
      color: $base-color;
    }

    .del-btn {
      padding: 10upx 0 10upx 36upx;
      font-size: $font-lg;
      color: $font-color-light;
      position: relative;

      &:after {
        content: "";
        width: 0;
        height: 30upx;
        border-left: 1px solid $border-color-dark;
        position: absolute;
        left: 20upx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  /* 多条商品 */
  .goods-box {
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .goods-item {
      width: 120upx;
      height: 120upx;
      margin-right: 20rpx;
      .goods-img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      width: 80%;
      .title {
        width: 350rpx;
        overflow: hidden; //超出一行文字自动隐藏
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap; //强制不换行
      }
    }
  }

  .price-box {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    font-size: $font-sm + 2upx;
    color: $font-color-light;
    align-self: flex-end;
    .num {
      margin: 0 8upx;
      color: $font-color-dark;
    }

    .price {
      font-size: $font-lg;
      color: $font-color-dark;

      &:before {
        content: "￥";
        font-size: $font-sm;
        margin: 0 2upx 0 8upx;
      }
    }
  }

  .action-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100upx;
    position: relative;
    padding-right: 30upx;
  }

  .action-btn {
    width: 160upx;
    height: 60upx;
    margin: 0;
    padding: 0;
    text-align: center;
    line-height: 60upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    background: #fff;
    border-radius: 100px;

    &:after {
      border-radius: 100px;
    }

    &.recom {
      color: $base-color;
    }
  }
}
</style>
