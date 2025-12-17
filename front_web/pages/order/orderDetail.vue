<template>
  <view class="content">
    <view class="row">
      <text class="yticon icon-daifukuan"></text>
      <view class="pay"><span>{{statusName}}</span>
        <span class="timer"
              v-if='status == 1'>到{{orderDetail.FinishDate}}订单自动关闭</span>
      </view>
    </view>
    <view class="row-c">
      <text class="yticon icon-shouhuodizhi"></text>

      <view class="localAddress">{{orderDetail.addrSnapshot.receiver}}<span>{{orderDetail.addrSnapshot.mobile}}</span>
        <view>{{orderDetail.addrSnapshot.province}}{{orderDetail.addrSnapshot.city}}{{orderDetail.addrSnapshot.area}}</view>
      </view>
    </view>
    <view class="store">
      <view>
        <view class="storeCenter"
              @click="jump()"
              style="margin-bottom: 40rpx;">
          <view class="store-l">
            <img :src="orderDetail.product.mainImage"
                   alt="">
          </view>
          <view class=" store-C">
            <span class="C-top">{{orderDetail.product.productName}}</span>
 <!--           <text class="attr"
                  v-for="(itemgg,indexgg) in item.arr"
                  :key="indexgg">{{itemgg.name}}:{{itemgg.list}}</text> -->
          </view>
          <view class="store-r">
            <span>￥{{orderDetail.product.price}}</span>
            <!-- <span class="count"> *{{item.Quantity}}</span> -->
          </view>
        </view>
      <!--  <view v-if="status == 2 && item.OrderItemsStatus != 6 && item.OrderItemsStatus != 9">
          <button class="add-btnT"
                  @click="confirm(3,item)">申请退款</button>
        </view>
        <view v-if="status == 2 && item.OrderItemsStatus == 6" style="display: flex;">
          <button class="add-btnT">退款中...</button>
		   <button class="add-btnT" @click.stop="cancelTui(item.OrderID)">取消退款</button>
        </view>
        <view v-if="status == 2 && item.OrderItemsStatus == 9">
          <button class="add-btnT">已退款</button>
        </view>
        <view v-if="status == 3 && item.OrderItemsStatus != 9 &&  item.OrderItemsStatus != 7">
          <button class="add-btnT"
                  @click="confirm(10,item)">退货</button>
        </view>
        <view v-if="item.OrderItemsStatus == 7" style="display: flex;">
          <button class="add-btnT">等待商家同意</button>
		   <button class="add-btnT" @click.stop="cancelTui(item.OrderID)">取消退货</button>
        </view>
        <view v-if="status == 3 && item.OrderItemsStatus == 9">
          <button class="add-btnT">已退款</button>
        </view> -->
      </view>
      <view class="storeFooter" style="padding-bottom: 110rpx;">
        <ul>
          <!-- <li>运费 <span>{{orderDetail.ModeName}}</span></li> -->
          <!-- <li>运费险<span>买家赠送</span></li> -->
          <!-- <li>优惠<span>-￥4.30</span></li> -->
          <li>实付款 (含运费)<span>￥{{ orderDetail.reSalePrice || orderDetail.actualPrice}}</span></li>
        </ul>
        <ul>
          <li class="top">订单信息</li>
          <!-- <li>支付方式：{{orderDetail.PaymentType}}</li> -->
          <li>订单编号: {{orderDetail.id}}<span class="copy"
                  @click="copyInfo(orderDetail.id,'订单号复制成功')">复制</span></li>
				   <li>所属人: {{orderDetail.product.belongUser.realName}}</li>
				   <li>联系方式: {{orderDetail.product.belongUser.userMobile}}</li>
          <li style='margin-bottom: 30rpx;'>下单时间: {{orderDetail.updateTime}}</li>
        </ul>
		<view class="yt-list-cell b-b" style="display: flex;justify-content: space-between;align-items: center;">
		  <text class="cell-tit clamp">微信收款码</text>
		  <img class="cell-tip" @click="previewShopImg(orderDetail.product.belongUser.wechatCode)" style="width: 50%;" :src="orderDetail.product.belongUser.wechatCode" alt="">
		</view>
		<view class="yt-list-cell b-b" style="display: flex;justify-content: space-between;align-items: center;margin-top:20rpx">
		  <text class="cell-tit clamp">支付宝收款码</text>
		  <img @click="previewShopImg(orderDetail.product.belongUser.aliCode)" class="cell-tip" style="width: 50%;" :src="orderDetail.product.belongUser.aliCode" alt="">
		</view>
      <!-- 底部 -->
      <view class="footer">
        <view class="price-content">
          <text>实付款</text>
          <text class="price-tip">￥</text>
          <text class="price">{{orderDetail.subPrice}}</text>
        </view>
        <text class="submit" v-if="orderDetail.orderStatus == 10"
              @click="submit">提交订单</text>
      </view>
      </view>
 <uni-popup ref="popups"
	             type="center">
	    <view>
	      <image class="preview-shopImg"
	             :src="shopImg" style="height: 720rpx;"></image>
	    </view>
	  </uni-popup>
	     <uni-popup ref="popup"
	                 type="center">
	        <view class="contact-popup">
				<view>上传支付凭证</view>
	        </view>
			<view class="updata" @click="updata()">
			  <view class="updata-box" v-if="!paypzImg">
			    <view class="updata-content">
			      <img src="../../static/temp/camera.png"></image>
			      <view>上传支付凭证</view>
			    </view>
			  </view>
			  <img
			    class="img"
			   v-else
			    :src="paypzImg"
			  ></img>
			</view>
	      </uni-popup>
    </view>
    <!-- <view v-if="status == 1">
			<button class="add-btn" @click="confirm(1)">取消订单</button>
			<button class="add-btn" @click="confirm(2)">立刻支付</button>
		</view> -->
    <!-- <view v-if="status == 3">
			<button class="add-btn" @click="confirm(6)">查看物流</button>
			<button class="add-btn" @click="confirm(4)">确认收货</button>
		</view> -->
  </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
  data() {
    return {
		paypzImg:'',
		shopImg: '',
      orderDetail: {
		  addrSnapshot:{},
		  product: {
			  belongUser: {}
		  }
	  },
      status: '', //订单状态
      orderId: '',
	  ProductId:''
    }
  },
  computed: {
    statusName() {
      if (this.status == 0) {
        return '等待买家付款...'
      }  else {
        return '交易完成'
      }
    }
  },
  onLoad(option) {
    this.orderId = option.orderId
    this.getShopDetail(option.orderId)
    this.status = option.status
  },
  methods: {
	  closePage(){
	  		  this.$refs.popup.close();
	  },
	  // 点击上传照片
	  updata(type) {
	    uni.chooseImage({
	      count: 1,
	      success: (res) => {
	        this.copyImg = res.tempFiles[0].path;
	        let uploadTask = uni.uploadFile({
	          url: this.$config.domain.api + 'tob/image/uploadToOss',
	          filePath: res.tempFiles[0].path,
	          name: 'file',
	  		header: {
	  			Authorization: uni.getStorageSync('token')
	  		},	
	          formData: {
	            action: 'VoucherUpload',
	            dlogo: true,
	          },
	          success: (res) => {
	            if (res.errMsg == 'uploadFile:ok') {
	  			  let data = JSON.parse(res.data)
	  			  if(data.code == '000000'){
	  					  this.paypzImg = data.data;
	  				  this.$api.msg('上传完成', 1500, true, 'none');
	  					  this.closePage()
	  			  }else{
	  				 this.$api.msg(res.msg)
	  			  }
	            }
	          },
	        });
	      },
	    });
	  },
	  async submit(){
		  if(!this.paypzImg){
		  		  this.$refs.popup.open();
				  return
		  }
		  let res = await this.$api.api.uploadPaymentProof({orderId: this.orderDetail.id,paymentProof: this.paypzImg})
		  if(res.code == '000000'){
			  this.$api.msg('购买成功')
			  setTimeout(function () {
			    uni.switchTab({
			      url: `/pages/user/user`,
			    });
			  }, 800)
		  }
	  },
	  previewShopImg (url) {
	  		this.shopImg = url
	    this.$refs.popups.open();
	  },
    //跳转详情
    jump(id) {
      uni.navigateTo({
        url: "/pages/product/product?ProductId=" + id
      })
    },
    copyInfo: function (data, info) {
      uni.setClipboardData({
        data: data,
        success: function () {
          uni.showToast({
            title: info
          })
        }
      });
    },
	cancelTui(order){
		uni.showModal({
		    title: '提示',
		    content: '确定要取消退款/退货？',
		    success: (res) => {
		        if (res.confirm) {
		            let data = {
		            	OrderId:order
		            }
		            let StringData = JSON.stringify(data)
		            let param = {
		            	action:"CancelRefund",
						data:StringData
		            }
		            this.$api.api.joinShopCart(param).then((res) => {
						uni.navigateBack({
							delta:1
						})
					})
		        } else if (res.cancel) {
		        }
		    }
		});
	},
    async getShopDetail(id) {
      let param = {
		id: id
      }
      let res = await this.$api.api.orderDetail(param)
	  if(res.code == '000000'){
		  console.log(res.data)
		  this.orderDetail = res.data
	  }else {
		  this.$api.msg(res.msg)
	  }
    },
    onBridgeReady(item) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        "appId": item.appid, //公众号名称，由商户传入     
        "timeStamp": item.timeStamp, //时间戳，自1970年以来的秒数     
        "nonceStr": item.nonceStr, //随机串     
        "package": "prepay_id=" + item.prepay_id,
        "signType": "MD5", //微信签名方式：     
        "paySign": item.paySign //微信签名 
      },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            uni.navigateTo({
              url: "/pages/money/paySuccess"
            })
          }
        });
    },
    confirm(index, item) {
      if (index == 4) {
        let req = {
          orderId: this.orderId,
          action: 'FinishOrder'
        }
        uni.showLoading({
          title: '确认收货中...'
        })
        setTimeout(() => {
          this.$api.api.FinishOrder(req).then((res) => {
            if (res.data.success == true) {
              uni.hideLoading();
              uni.switchTab({
                url: '/pages/index/index'
              })
            } else {
              uni.hideLoading();
              this.$api.msg(res.data.msg)
            }
          })
        }, 600)
      }
      if (index == 3) {
		 if(this.ProductId == "5555" || this.ProductId == "5560") return this.$api.msg("此订单不支持退款")
        let that = this
        uni.showModal({
          title: '提示',
          content: '确定不要货了吗？',
          success: function (res) {
            if (res.confirm) {
              setTimeout(() => {
                that.$store.commit('saveRefund', item)
                uni.navigateTo({
                  url: `/pages/order/ApplyForRefund`
                })
              }, 600)
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
      if (index == 2) {
        uni.showLoading({
          title: '加载中...'
        });
        let VoucherNumber = ''
        let param = {
          action: 'Pay',
          VoucherNumber: VoucherNumber,
          OpenId: uni.getStorageSync('openId')
        }
        uni.hideLoading()
        this.$api.api.payWay(param).then((res) => {
          if (res.data.status == 'true') {
            this.onBridgeReady(res.data)
          }
        })
      }
      if (index == 10) {
        let that = this
        uni.showModal({
          title: '提示',
          content: '确定不要货了吗？',
          success: function (res) {
            if (res.confirm) {
              that.$store.commit('saveRefund', item)
              setTimeout(() => {
                uni.navigateTo({
                  url: './returnGoods'
                })
                // let param = {
                // 	action:'RequestReturn',
                // 	OrderItemID:that.orderDetail.LineItemsList[0].ID
                // }
                // that.$api.api.RequestReturn(param).then((res) => {
                //  if(res.data.status == true){
                //  	that.$api.msg('提交成功，请耐心等待')
                //  	setTimeout(function(){
                //  		uni.navigateBack({
                //  			delta:2
                //  		})
                //  	},1000)
                //  }
                // })
              }, 600)
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
      if (index == 1) {
        //取消订单
        let that = this
        uni.showModal({
          title: '提示',
          content: '确定不要货了吗？',
          success: function (res) {
            if (res.confirm) {
              setTimeout(() => {
                // let {
                // 	stateTip,
                // 	stateTipColor
                // } = this.orderStateExp(status);
                let req = {
                  orderId: that.orderId,
                  action: 'CancelOrder'
                }
                that.$api.api.cancelOrder(req).then((res) => {
                  console.log(res)
                  if (res.data.success == true) {
                    uni.switchTab({
                      url: '/pages/index/index'
                    })
                  } else {
                    that.$api.msg(res.data.msg)
                  }
                  // if (res.data.code == this.$status.req_suc) {
                  // 	uni.hideLoading();
                  // 	this.navList[index].orderList[idx].status = 9
                  // }
                })
              }, 600)
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });

      }
      if (index == 6) {
        let param = {
          OrderId: this.orderId,
          action: 'Logistic'
        }
        this.$api.api.Logistic(param).then((res) => {
          if (res.data.success == true) {
            // 判断平台  
            if (plus.os.name == 'Android') {
              plus.runtime.launchApplication({
                pname: 'http://m.kuaidi100.com/index_all.html?postid=773032974383712&amp;type=shentong&amp;callbackurl=http%3A%2F%2Fb2c.nyakarlek.cn%2FVshop%2FMyLogistics.aspx%3FOrderId%3D200329154951705%26ReferralId%3D1104'
              },
                function (e) {
                  console.log('Open system default browser failed: ' + e.message);
                }
              );
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
	.contact-popup {
	  padding: 30rpx;
	  background-color: #f5f5f5;
	  border-radius: 20rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  > view {
	    width: 420rpx;
	    text-align: center;
	    margin: 10rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    border-radius: 20rpx;
	    background-color: #fff;
	  }
	}
	// 上传照片区域
	.updata {
	  position: relative;
	  margin: 20rpx auto;
	  background-color: #f5f5f5;
	  width: 580rpx;
	  height: 580rpx;
	  border: 1rpx dashed #6c7aa7;
	  .img {
	    width: 100%;
	    height: 100%;
	  }
	  .updata-box {
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    .updata-content {
	      display: flex;
	      flex-direction: column;
	      align-items: center;
	      justify-content: space-evenly;
	      > img {
	        margin-bottom: 20rpx;
	        width: 100rpx;
	        height: 100rpx;
	      }
	    }
	  }
	}
	.footer {
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  z-index: 995;
	  display: flex;
	  align-items: center;
	  width: 100%;
	  height: 90upx;
	  justify-content: space-between;
	  font-size: 30upx;
	  background-color: #fff;
	  z-index: 998;
	  color: $font-color-base;
	  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	
	  .price-content {
	    padding-left: 30upx;
	  }
	
	  .price-tip {
	    color: $base-color;
	    margin-left: 8upx;
	  }
	
	  .price {
	    font-size: 36upx;
	    color: $base-color;
	  }
	
	  .submit {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 280upx;
	    height: 100%;
	    color: #fff;
	    font-size: 32upx;
	    background-color: #323f6c;
	  }
	}
page {
  background: $page-color-base;
  padding-top: 16upx;
}

.content {
  padding: 0 30upx;
  background: #fff;
}

.row {
  display: flex;
  justify-content: space-between;
  height: 200upx;
  line-height: 200upx;
}

.row-c {
  display: flex;
  height: 200upx;
}

.icon-shouhuodizhi {
  margin-right: 10upx;
  font-size: 50upx;
  line-height: 80upx;
}

.localAddress > span {
  color: #909399;
}

.icon-daifukuan {
  font-size: 100upx;
}

.pay {
  display: flex;
  flex-direction: column;

  // line-height: 200upx;
}

.pay span:first-child {
  margin-top: 55upx;
  align-self: flex-end;
}

.timer {
  font-size: 12px;
  color: #909399;
}

.storeCenter {
  display: flex;
}

.storeTop {
  display: flex;
  margin-bottom: 20upx;
}

.icon-you {
  margin-left: 20upx;
}

.store-l {
  flex: 2;
}

.store-l img {
  width: 160rpx;
  height: 100%;
}

.store-C {
  display: flex;
  flex-direction: column;
  flex: 4;
  margin-left: 10upx;
}

.clothes,
.color,
.size,
.count {
  color: #909399;
}

.store-r {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.store-r span {
  align-self: flex-end;
}

ul {
  padding: 0;
  margin-top: 20upx;
}

li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.top {
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10upx;
}

.top:before {
  content: "";
  height: 40upx;
  border-left: 6upx solid $base-color;
  margin-top: 6upx;
  margin-right: 10upx;
}

.copy {
  color: $base-color;
}

.add-btnT {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300upx;
  height: 80upx;
  margin: 60upx auto;
  font-size: $font-lg;
  color: #fff;
  background-color: #323f6c;
  border-radius: 10upx;
  box-shadow: 1px 2px 5px rgba(50, 63, 108, 0.4);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300upx;
  height: 80upx;
  margin: 60upx 20upx;
  font-size: $font-lg;
  color: #fff;
  background-color: #323f6c;
  border-radius: 10upx;
  box-shadow: 1px 2px 5px rgba(50, 63, 108, 0.4);
  float: left;
}
</style>
