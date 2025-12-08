<template>
  <view class="container">
    <!-- 空白页 -->
    <view
          class="empty">
      <image src="/static/kk.png"
             mode="aspectFit"></image>
      <view v-if="hasLogin"
            class="empty-tips">
        购物商品
        <navigator class="navigator"
                   v-if="hasLogin"
                   url="../index/index"
                   open-type="switchTab">随便逛逛></navigator>
      </view>
      <view v-else
            class="empty-tips">
        购物商品
        <view class="navigator"
              @click="navToLogin">去购物></view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  mapState
} from 'vuex';
import uniNumberBox from '@/components/uni-number-box.vue'
export default {
  components: {
    uniNumberBox
  },
  data () {
    return {
      total: 0, //总价格
      allChecked: false, //全选状态  true|false
      empty: false, //空白页现实  true|false
      cartList: [],
      start: 0, //起始页
      totalList: null, //总数
      hasLogin: ''
    };
  },
  onLoad () {
    // this.loadData();
  },
  onShow () {
    // this.allChecked = false
    // this.hasLogin = uni.getStorageSync('token')
    // if (this.hasLogin) {
    //   this.start = 0
    //   this.cartList = []
    //   this.total = 0
    //   this.getCartList()
    // }
  },
  watch: {
    //显示空白页
    // cartList(e){
    // 	let empty = e.length === 0 ? true: false;
    // 	if(this.empty !== empty){
    // 		this.empty = empty;
    // 	}
    // }
  },
  onReachBottom () {
    this.getCartList()
  },
  computed: {
    // ...mapState(['hasLogin'])
  },
  methods: {
    //跳转详情
    jump (id) {
      console.log(id)
      uni.navigateTo({
        url: `../product/product?ProductId=${id}`
      })
    },
    // 获取购物车列表
    async getCartList () {
      if (this.total <= this.start && this.start != 0) {
        return
      }
      let data = {
        action: 'GetCartLists',
        PageIndex: Math.ceil(this.start / 10) == 0 ? "1" : Math.ceil(this.start / 10) + 1,
        PageSize: 10
      }
      let res = await this.$api.api.getCartList(data);
      if (res.data.status == true) {
        if (!res.data.data) {
          this.empty = true;
        } else {
          let result = res.data.data[0].LineItems
          this.totalList = res.data.data[0].Total
          let cartList = result.map(item => {
            item.checked = false;
            return item;
          });
          cartList.forEach((item, index) => {
            item.arr = []
            item.ThumbnailUrl310 = this.$config.domain.api + item.ThumbnailUrl310
            item.Attributes = item.Attributes.split(",")
            item.AttributesValue = item.AttributesValue.split(',')
            for (var i = 0; i < item.Attributes.length; i++) {
              item.obj = {}
              item.obj.name = item.Attributes[i]
              item.obj.list = item.AttributesValue[i]
              item.arr.push(item.obj)
            }
          })
          this.start += cartList.length
          this.cartList = this.cartList.concat(cartList)
          let empty = this.cartList.length === 0 ? true : false;
          this.empty = empty;
        }
      }
    },
    //请求数据
    async loadData () {
      let list = await this.$api.json.cartList;
      let cartList = list.map(item => {
        item.checked = false;
        return item;
      });
      this.cartList = cartList;
      this.calcTotal(); //计算总价
    },
    //监听image加载完成
    onImageLoad (key, index) {
      this.$set(this[key][index], 'loaded', 'loaded');
    },
    //监听image加载失败
    onImageError (key, index) {
      this[key][index].image = '/static/errorImage.jpg';
    },
    navToLogin () {
      uni.navigateTo({
        url: '/pages/product/list'
      })
    },
    //选中状态处理
    check (type, index) {
      console.log(type, index)
      if (type === 'item') {
        this.cartList[index].checked = !this.cartList[index].checked;
      } else {
        const checked = !this.allChecked
        const list = this.cartList;
        list.forEach(item => {
          item.checked = checked;
        })
        this.allChecked = checked;
      }
      this.calcTotal(type);
    },
    //数量
    numberChange (data) {
      uni.showLoading({
        title: "加载中...",
        mask: true
      })
      this.cartList[data.index].Quantity = data.number;
      let skuId = this.cartList[data.index].SkuId
      let param = {
        action: 'ChageQuantity',
        skuId: skuId,
        quantity: data.number
      }
      this.$api.api.chageQuantity(param).then((res) => {
        console.log(res.data)
        if (res.data.status == true) {
          uni.hideLoading()
          this.calcTotal();
        } else {
          this.$api.msg(res.data.message)
          // this.stock = res.data.stock
        }
      })
    },
    //删除
    deleteCartItem (index) {
      uni.showModal({
        content: '确定删除?',
        success: (res) => {
          if (res.confirm) {
            this.deleteCartItems(index)
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    async deleteCartItems (index) {
      let list = this.cartList;
      let row = list[index];
      let id = row.SkuId;
      let data = {
        action: "DeleteCartProduct",
        skuId: id
      }
      let res = await this.$api.api.deleteCartProduct(data)
      if (res.data.status == true) {
        this.cartList.splice(index, 1);
        this.$api.msg(res.data.message)
        this.calcTotal();
        uni.hideLoading();
      }
    },
    //清空
    clearCart () {
      uni.showModal({
        content: '清空购物车？',
        success: (e) => {
          if (e.confirm) {
            this.cartList = [];
          }
        }
      })
    },
    //计算总价
    calcTotal () {
      let list = this.cartList;
      if (list.length === 0) {
        this.empty = true;
        return;
      }
      let total = 0;
      let checked = true;
      list.forEach(item => {
        if (item.checked === true) {
          total += item.Quantity * item.MemberPrice;
        } else if (checked === true) {
          checked = false;
        }
      })
      this.allChecked = checked;
      this.total = Number(total.toFixed(2));
    },
    //创建订单
    createOrder () {
      let list = this.cartList;
      let goodsData = [];
      list.forEach(item => {
        if (item.checked) {
          goodsData.push(item)
        }
      })
      if (goodsData.length < 1) {
        this.$api.msg('请勾选您的产品')
        return
      }
      if (this.total < 500) {
        return this.$api.msg('购买的总金额需要大于 500', 2000, false, 'none')
      }
      console.log(goodsData)
      this.$store.commit('shopList', goodsData)
      let price = this.total
      uni.navigateTo({
        url: `/pages/order/createOrder?price=${price}`
      })
    }
  }
}
</script>

<style lang='scss'>
/deep/.uni-numbox {
  height: 60rpx;
  width: 180rpx;

  > view {
    width: 33.33%;
    line-height: 60rpx;
  }

  .yticon {
    font-size: 24rpx;
  }

  .uni-numbox-value {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
  }
}

.container {
  padding-bottom: 134upx;

  /* 空白页 */
  .empty {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding-bottom: 100upx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;

    image {
      width: 240upx;
      height: 160upx;
      margin-bottom: 30upx;
    }

    .empty-tips {
      display: flex;
      font-size: $font-sm + 2upx;
      color: $font-color-disabled;

      .navigator {
        color: #323f6c;
        margin-left: 16upx;
      }
    }
  }
}

/* 购物车列表项 */
.cart-item {
  display: flex;
  position: relative;
  padding: 30upx 40upx;

  .image-wrapper {
    width: 230upx;
    height: 230upx;
    flex-shrink: 0;
    position: relative;

    image {
      border-radius: 8upx;
    }
  }

  .checkbox {
    position: absolute;
    left: -16upx;
    top: -16upx;
    z-index: 8;
    font-size: 44upx;
    line-height: 1;
    padding: 4upx;
    color: $font-color-disabled;
    background: #fff;
    border-radius: 50px;
  }

  .item-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
    padding-left: 30upx;

    .title {
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      height: 40upx;
      line-height: 32upx;
    }

    .price {
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      height: 40upx;
      line-height: 20upx !important;
    }

    .attr-box {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .attr {
      font-size: $font-sm + 2upx;
      color: $font-color-light;
      height: 50upx;
      line-height: 32upx;
    }

    .price {
      height: 50upx;
      line-height: 50upx;
    }
  }

  .del-btn {
    padding: 4upx 10upx;
    font-size: 34upx;
    height: 50upx;
    color: $font-color-light;
  }
}

/* 底部栏 */
.action-section {
  /* #ifdef H5 */
  margin-bottom: 100upx;
  /* #endif */
  position: fixed;
  left: 30upx;
  bottom: 30upx;
  z-index: 95;
  display: flex;
  align-items: center;
  width: 690upx;
  height: 100upx;
  padding: 0 30upx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16upx;

  .checkbox {
    height: 52upx;
    position: relative;

    image {
      width: 52upx;
      height: 100%;
      position: relative;
      z-index: 5;
    }
  }

  .clear-btn {
    position: absolute;
    left: 26upx;
    top: 0;
    z-index: 4;
    width: 0;
    height: 52upx;
    line-height: 52upx;
    padding-left: 38upx;
    font-size: $font-base;
    color: #fff;
    background: $font-color-disabled;
    border-radius: 0 50px 50px 0;
    opacity: 0;
    transition: 0.2s;

    &.show {
      opacity: 1;
      width: 120upx;
    }
  }

  .total-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: right;
    padding-right: 40upx;

    .price {
      font-size: $font-lg;
      color: $font-color-dark;
    }

    .coupon {
      font-size: $font-sm;
      color: $font-color-light;

      text {
        color: $font-color-dark;
      }
    }
  }

  .confirm-btn {
    padding: 0 38upx;
    margin: 0;
    border-radius: 100px;
    height: 76upx;
    line-height: 76upx;
    font-size: $font-base + 2upx;
    background: #323f6c;
    box-shadow: 1px 2px 5px rgba(50, 63, 108, 0.72);
  }
}

/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
  color: $uni-color-primary;
}
</style>
