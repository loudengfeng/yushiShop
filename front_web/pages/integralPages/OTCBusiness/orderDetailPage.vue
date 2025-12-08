<template>
  <view>
    <view class="hd-list border">
      <text>成交时间</text>
      <text>交易金额</text>
      <text>交易数量</text>
      <text>交易状态</text>
    </view>
    <view class="hd-list"
          v-for="(item, index) in list"
          :key="index"
          style="height: 100rpx;"
          @click="
        jump(
          item.OrderStatus,
          item.TransactionType,
          item.FishRecordId,
          item.SellerUserId,
          item.BuyerUserId,
          item.IsSupport,
		  item.AppealDate,
		  item.PleaReason
        )
      ">
      <text>{{ item.CreateDate }}</text>
      <text>{{ item.total }}</text>
      <text>{{ item.FishNumber }}</text>
      <text>{{ item.OrderStatus }}</text>
      <!-- <text v-else>{{item.IsSupport}}</text> -->
    </view>
    <uniLoadMore :status="loadingType"></uniLoadMore>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      list: [],
      start: 0,
      // 总的数据条数
      total: null,
      id: '',
      loadingType: 'more',
	  control:0
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: options.id,
    });
    this.id = options.id;
  },
  onShow() {
	 this.list = []
	 this.start = 0
	 this.total = null 
    this.getshu();
  },
  onPullDownRefresh() {
   if(this.control == 0){
	   this.control = 1
	   this.list = []
	   this.start = 0
	   this.total = null
	   this.getshu();
	   setTimeout(function () {
	     uni.stopPullDownRefresh();
	   }, 300);
   }
  },
  onReachBottom() {
    this.getshu();
  },
  methods: {
    jump(status, flag, FishRecordId, SellerUserId, BuyerUserId, IsSupport,AppealDate,PleaReason) {
      let userId = uni.getStorageSync('UserId');
      if (
        status == '胜诉' ||
        status == '接单超时' || status == '取消'
      ) {
        return;
      }
      if (status == '败诉') return uni.showModal({
        title: '提示',
        showCancel: false,
        content: '有问题去联系客服',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
      if (status == "完成") {
        return uni.navigateTo({
          url: "/pages/FishCurrency/transaction/orderDetail/orderOver?orderId=" + FishRecordId
        })
      }
      if (status == '申诉中') {
		return this.$api.msg("正在申诉中")
        return uni.navigateTo({
          url: '/pages/FishCurrency/transaction/appeal/appeal?id=' + FishRecordId,
        });
      }
      if (status == '应诉') {
		  if(PleaReason) return this.$api.msg("等待应诉结果")
        return uni.navigateTo({
          url: '/pages/FishCurrency/transaction/appeal/appeal?id=' + FishRecordId + "&pp=1",
        });
      }
      if (SellerUserId == userId) {
        if (!flag) {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
              FishRecordId,
          });
        } else {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/payInfo?orderId=' + FishRecordId,
          });
        }
      } else if (BuyerUserId == userId) {
        if (flag) {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
              FishRecordId,
          });
        } else {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/payInfo?orderId=' + FishRecordId,
          });
        }
      }
    },
    async getshu() {
		uni.showLoading({
			title:"加载中..."
		})
      let data = {
        FishOrderId: this.id,
        Captain: 1,
        Offset: Math.ceil(this.start / 10), //页面
        RowNumber: 10, //条数
      };
      let StringData = JSON.stringify(data);
      let param = {
        data: StringData,
        action: 'ReadFishOrderRecord',
      };
      let res = await this.$api.api.assets(param);
      if (res.data.status == true) {
		  uni.hideLoading()
		  this.control = 0
        let userId = uni.getStorageSync('UserId');
        res.data.data.forEach((item, index) => {
          if (item.OrderStatus == 0) {
            item.OrderStatus = '待支付';
          }
          if (item.OrderStatus == 1) {
            item.OrderStatus = '未支付';
          }
          if (item.OrderStatus == 2) {
            item.OrderStatus = '已支付';
          }
          if (item.OrderStatus == 10) {
            item.OrderStatus = '完成';
          }
          if (item.OrderStatus == 11) {
            item.OrderStatus = '取消';
          }
          if (item.OrderStatus == 12) {
            if (item.SellerUserId == userId) {
              if (item.Appealer) {
                item.OrderStatus = '申诉中';
              } else {
                item.OrderStatus = '应诉';
              }
            }
          }
          if (item.OrderStatus == 13) {
            item.OrderStatus = '拒绝接单';
          }
          if (item.OrderStatus == 14) {
            item.OrderStatus = '接单超时';
          }
          if (item.Appealer) {
            //胜诉方
            if (item.SellerUserId == userId) {
              //发起方
              if (!item.TransactionType) {
                if (item.IsSupport === true) {
                  item.OrderStatus = '胜诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '败诉';
                }
              } else {
                //买
                if (item.IsSupport === true) {
                  item.OrderStatus = '胜诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '败诉';
                }
              }
            } else {
              if (!item.TransactionType) {
                if (item.IsSupport === true) {
                  item.OrderStatus = '败诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '胜诉';
                }
              } else {
                if (item.IsSupport === true) {
                  item.OrderStatus = '败诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '胜诉';
                }
              }
            }
          } else {
            if (item.SellerUserId == userId) {
              if (!item.TransactionType) {
                if (item.IsSupport === true) {
                  item.OrderStatus = '胜诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '败诉';
                }
              } else {
                if (item.IsSupport === true) {
                  item.OrderStatus = '败诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '胜诉';
                }
              }
            } else {
              if (item.TransactionType) {
                if (item.IsSupport === true) {
                  item.OrderStatus = '胜诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '败诉';
                }
              } else {
                if (item.IsSupport === true) {
                  item.OrderStatus = '败诉';
                } else if (item.IsSupport === false) {
                  item.OrderStatus = '胜诉';
                }
              }
            }
          }
          item.total = parseInt(parseFloat(item.FishPrice) * parseFloat(item.FishNumber)).toFixed(2);
        });
        this.total = res.data.sum[0].count;
        this.start += res.data.data.length;
        this.list = this.list.concat(res.data.data);
        this.loadingType = this.total > this.start ? 'more' : 'nomore';
      }
    },
  },
};
</script>

<style lang="scss">
.hd-list {
  height: 80rpx;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f5f5f5;

  text {
    flex: 1;
    display: block;
    text-align: center;
  }
}

.border {
  border-bottom: 15rpx solid #f5f5f5;
}
</style>
