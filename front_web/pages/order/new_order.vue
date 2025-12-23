<template>
	<view class="content">
		<view class="navbar" ref="mybox">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex == index }"
			 @click="tabClick(index)">
				{{ item.text }}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					<view class="tip-container" v-if="!(tabItem.loaded === true && tabItem.orderList.length === 0) && tabItem.state == 10">
					  <text class="tip-label">今日所需转卖的上架费用:</text>
					  <text class="tip-content">¥{{zmPrice}}</text>
					</view>	
					<!-- 订单列表 -->
					<view v-for="(item, index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">订单编号：{{ item.id }}</text>
							<text class="state" :style="{ color: item.stateTipColor }" v-if="item.orderStatus == 10">买入订单</text>
							<text class="state" :style="{ color: item.stateTipColor }" v-if="item.orderStatus == 10">待付款</text>
							<text class="state" :style="{ color: item.stateTipColor }" v-if="item.orderStatus == 100">交易成功</text>
						<!-- 	<text class="state" :style="{ color: item.stateTipColor }" v-if="item.orderStatus == 3">待收货</text>
							<text class="state" :style="{ color: item.stateTipColor }" v-if="item.orderStatus == 4">已关闭</text> -->
							<!-- <text class="state"
                    :style="{ color: item.stateTipColor }"
                    v-if="item.OrderStatus == 5">待评价</text> -->
							<!-- <text v-if="item.status==9" class="color">订单已关闭</text><text class="del-btn yticon icon-iconfontshanchu1" v-if="item.status==9"
							 @click="deleteOrder(tabIndex,item.id,index)"></text> -->
						</view>

						<!-- <scroll-view v-if="item.rzOrderDetailDtos.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.rzOrderDetailDtos" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.webUrl" mode="aspectFill"></image>
							</view>
						</scroll-view> -->
						<view class="goods-box" style="margin-bottom: 20rpx;"
						 @click="jumpDetail(item.id,item.orderStatus)">
							<view class="goods-item">
								<img class="goods-img" :src="item.product.mainImage" mode="aspectFill"></img>
							</view>
							<view class="right">
								<text class="title clamp">{{ item.product.productName }}</text>
								<!-- <text>{{ item.product.productDesc }}</text> -->
								<!-- <view class="right-text" v-if="
                    item.OrderStatus == 5 &&
                    !itemGood.IsEvaluted &&
                    itemGood.OrderItemsStatus != 9
                  "
								 @click.stop="jumppj(itemGood)">
									评价
								</view>
								<view class="right-text" v-if="itemGood.OrderItemsStatus == 6">
									退款中
								</view>
								<view class="right-text" style="background-color: #ffffff; color: #fa436a;" v-if="itemGood.OrderItemsStatus == 7">
									等待商家同意
								</view>
								<view class="right-text" style="background-color: #ffffff; color: #fa436a;" v-if="itemGood.OrderItemsStatus == 7">
									等待商家同意
								</view>
								<view class="right-text" v-if="itemGood.OrderItemsStatus == 10">
									同意退货
								</view>
								<view class="right-text" v-if="itemGood.OrderItemsStatus == 100" :class="itemGood.OrderItemsStatus == 100 ? 'activeys' : ''">
									已评价
								</view> -->
							</view>
						</view>

						<view class="price-box">
							<!-- 共 -->
							<!-- <text class="num">{{item.rzOrderDetailDtos.length}}</text> -->
							 
							<text class="price">{{ item.reSalePrice || item.actualPrice }}</text>
						</view>
						<view class="action-box b-t" v-if="item.orderStatus == 10">
							<button class="action-btn" @click.stop="
                  cancelOrder(item.id, cancelnum, tabIndex, index)
                ">
								取消订单
							</button>
							<button class="action-btn recom" @click.stop="jumpDetail(item.id,item.orderStatus)">
								立即支付
							</button>
						</view>
						<!--  <view class="action-box b-t"
                  v-if="item.OrderStatus ==2">
              <button class="action-btn"
                      @click.stop="RequestReturn(item)">申请退货</button>
            </view> -->
						<view class="action-box b-t" v-if="item.OrderStatus == 3">
							<button class="action-btn" @click.stop="
                  checkWL(item.ExpressCompanyAbb, item.ShipOrderNumber)
                ">
								查看物流
							</button>
							<!-- <button class="action-btn recom"
			  v-if="item.OrderItemsStatus == 7"
                      @click.stop="confirm(item.OrderId, tabIndex, index)">
               等待商家退货
              </button> -->
							<button class="action-btn recom" @click.stop="confirm(item.OrderId, tabIndex, index)">
								确认收货
							</button>
						</view>
						<!-- <view class="action-box b-t" v-if="item.OrderStatus ==4">
							<button class="action-btn recom" @click.stop="jump(item)">申请退货</button>
						</view> -->
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from '@/components/empty';
	export default {
		components: {
			uniLoadMore,
			empty,
		},
		data() {
			return {
				zmPrice: 0,
				cancelnum: 9,
				tabCurrentIndex: 0,
				OpenId:uni.getStorageSync('openId'),
				navList: [
					{
						state: 10,
						text: '买入订单',
						loadingType: 'more',
						orderList: [],
						start: 0,
						total: null,
					},
					{
						state: 10,
						text: '待付款',
						loadingType: 'more',
						orderList: [],
						start: 0,
						total: null,
					},
					// {
					// 	state: 4,
					// 	text: '已关闭',
					// 	loadingType: 'more',
					// 	orderList: [],
					// 	start: 0,
					// 	total: null
					// },
					{
						state: 100,
						text: '已付款',
						loadingType: 'more',
						orderList: [],
						start: 0,
						total: null,
					},
				],
				buyList: [
					// #ifdef H5 || MP-WEIXIN
					{
						name: "微信支付",
						payType: 88,
						price: "",
						checked: uni.getStorageSync('isWeixin')
					},
					{
						name: "支付宝支付",
						payType: 55,
						price: "",
						checked: !uni.getStorageSync('isWeixin')
					},
					// #endif
					// app 的微信支付和支付宝支付
					// #ifdef APP-PLUS
					{
						name: "微信支付",
						payType: 88,
						price: "",
						checked: true
					},
					{
						name: "支付宝支付",
						payType: 55,
						price: "",
						checked: true
					}
					// #endif
				],
			};
		},

		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			// const stateObj = {
			// 	0: 100,
			// 	1: 99,
			// 	2: 0,
			// 	3: 100
			// }
			this.tabCurrentIndex = options.state;
			// // #ifndef MP
			this.loadData();
			// // #endif
			// // #ifdef MP
			// if (options.state == 0) {
			// 	//查看全部商品
			// 	this.loadData();
			// }
			// // #endif
		},
		//加载更多
		onReachBottom() {
			if (
				this.navList[index].total <= this.navList[index].start &&
				this.navList[index].start != 0
			) {
				return;
			}
			this.loadData();
		},
		methods: {
			checkWL(name, code) {
				uni.navigateTo({
					url: './open?name=' + name + '&code=' + code,
				});
			},
			jumpDetail(id, status) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?orderId=${id}&status=${status}`,
				});
			},
			gotoWxPay(id) {
				// #ifdef H5 || MP-WEIXIN
				let param = {
					action: 'Pay',
					VoucherNumber: id,
					OpenId: this.OpenId
				}
				uni.hideLoading()
				this.$api.api.payWay(param).then((res) => {
					if (res.data.status == 'true') {
						this.onBridgeReady(res.data)
					}
				})
				// #endif
				// #ifdef APP-PLUS
				this.getOrder(id)
				// #endif
			},
			gotoAlPay(id) {
				// #ifdef H5 || MP-WEIXIN
				this.getAliPayH5(id)
				// #endif
				// #ifdef APP-PLUS
				this.getAliPay(id)
				// #endif
			},
			// app微信支付
			async getOrder(VoucherNumber) {
				let data = {
					action: 'APPPay',
					VoucherNumber: VoucherNumber,
				}
				let res = await this.$api.api.payWay(data)
				// console.log(res.data.data)
				let orderInfo = res.data
				// if (res.data.status == 'true') {
				// console.log(orderInfo)
				if (orderInfo.statusCode !== 200) {
					console.log("获得订单信息失败", orderInfo);
					uni.showModal({
						content: "获得订单信息失败",
						showCancel: false
					})
					return;
				}
				let oreder = orderInfo.data
				console.log(oreder)
				// oreder.appId = 'wxbb851b0e79cbe797'

				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: oreder,
					// _debug: 1,
					success: (e) => {
						console.log("success", e);
						uni.showToast({
							title: "感谢您的赞助!"
						})
					},
					fail: (e) => {
						console.log("fail", e);
						uni.showModal({
							content: "支付失败,原因为: " + e.errMsg,
							showCancel: false
						})
					}
				})
				// }
			},
			// 支付宝支付 app
			async getAliPay(VoucherNumber) {
				let datas = {
					VoucherNumber: VoucherNumber,
				}
				let res = await this.$api.api.aliPay(datas)
				// console.log(res)
				let orderInfo = res
				if (orderInfo.statusCode !== 200) {
					console.log("获得订单信息失败", orderInfo);
					uni.showModal({
						content: "获得订单信息失败",
						showCancel: false
					})
					return;
				}
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo.data,
					success: result => {
						this.$api.msg('支付成功')
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/order/order?state=0'
							});
						}, 600);
					},
					fail: err => {
						console.log(err)
						uni.navigateBack({
							delta: 2
						});
					}
				})
			},
			// h5阿里支付
			async getAliPayH5(VoucherNumber) {
				let data = {
					VoucherNumber: VoucherNumber,
					Driver: 'Wap',
					QuitUrl: 'http://xdkb2c.gup-group.cn/pages/order/order?state=0',
					ReturnUrl: 'http://xdkb2c.gup-group.cn/pages/order/order?state=0'
				}
				let res = await this.$api.api.aliPay(data)
				console.log(res)
				document.querySelector('body').innerHTML = res;
				const div = document.createElement('div') // 创建div
				div.innerHTML = res.data // 将返回的form 放入div
				document.body.appendChild(div)
				document.forms[0].submit()
				// locahost.href = res.data
				// this.zfbWeb = res.data
				// this.isZfb = true
			},
			pay(item, PaymentTypeId) {
				if (PaymentTypeId == 88) {
					this.gotoWxPay(item)
					return
				}
				if (PaymentTypeId == 55) {
					this.gotoAlPay(item)
					return
				}
				this.buyList.forEach((item, index) => {
					if (item.payType == PaymentTypeId) {

					}
				})
				uni.showLoading({
					title: '加载中...',
				});
				let param = {
					action: 'Pay',
					VoucherNumber: item,
					OpenId: uni.getStorageSync('openId'),
				};
				uni.hideLoading();
				this.$api.api.payWay(param).then((res) => {
					if (res.data.status == 'true') {
						this.onBridgeReady(res.data);
					}
				});
			},
			onBridgeReady(item) {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						appId: item.appid, //公众号名称，由商户传入
						timeStamp: item.timeStamp, //时间戳，自1970年以来的秒数
						nonceStr: item.nonceStr, //随机串
						package: 'prepay_id=' + item.prepay_id,
						signType: 'MD5', //微信签名方式：
						paySign: item.paySign, //微信签名
					},
					function(res) {
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							uni.navigateTo({
								url: '/pages/money/paySuccess',
							});
						}
					}
				);
			},
			//获取订单列表
			loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state; //订单状态
				if (source === 'tabChange' && navItem.loaded === true) {
					navItem.orderList = [];
					navItem.start = 0;
				}
				// if (navItem.loadingType === 'loading') {
				//   //防止重复加载
				//   return;
				// }

				navItem.loadingType = 'loading';

				setTimeout(() => {
					// //我的仓库
					// if (index == 0) {
					// 	this.req_status(navItem.start, 100, index);
					// }
					//买入订单
					 if (index == 0) {
						this.req_status(navItem.start, 10, index);
					}
					// 待付款
					else if (index == 1) {
						this.req_status(navItem.start,10, index);
					}
					//已付款
					else if (index == 2) {
						this.req_status(navItem.start, 100, index);
					}
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);

					//判断是否还有数据， 有改为 more， 没有改为noMore
					navItem.loadingType = 'more';
				}, 600);
			},

			//商品列表状态请求封装
			req_status(start, status, index) {
				let req = {
					orderStatus: status,
					page: Math.ceil(start / 10) == 0 ? 1 : Math.ceil(start / 10) + 1,
					pageSize: 10,
				};
				this.$api.api.orderList(req).then((res) => {
					if (res.code == '000000') {
						let order = res.data.records
						// order.forEach((item, index) => {
						// 	item.LineItemsList.forEach((itemList, indexList) => {
						// 		itemList.ThumbnailsUrl =
						// 			this.$config.domain.api + itemList.ThumbnailsUrl;
						// 		item.arr = [];
						// 		if (item.Attributes != null && item.AttributesValue != null) {
						// 			item.Attributes = item.Attributes.split(',');
						// 			item.AttributesValue = item.AttributesValue.split(',');
						// 			for (var i = 0; i < item.Attributes.length; i++) {
						// 				item.obj = {};
						// 				item.obj.name = item.Attributes[i];
						// 				item.obj.list = item.AttributesValue[i];
						// 				item.arr.push(item.obj);
						// 			}
						// 		}
						// 	});
						// });
						this.navList[index].total = res.data.total;
						this.navList[index].start += order.length;
						this.navList[index].loadingType =
							this.navList[index].total > this.navList[index].start ?
							'more' :
							'nomore';
						this.navList[index].orderList = this.navList[index].orderList.concat(
							order
						);
						if(status == '10'){
							let zmPriceList = this.navList[index].orderList.map(e => e.subPrice)
							let sum = 0;
							zmPriceList.forEach(num => {
							  sum += num;
							});
							this.zmPrice = sum
						}
						console.log(this.navList);
					}
				});
			},
			jumppj(itemGood) {
				console.log(itemGood);
				var itemGood = JSON.stringify(itemGood);
				uni.navigateTo({
					url: '/pages/evaluate/releaseComments?itemGood=' + itemGood,
				});
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index, id, idx) {
				uni.showLoading({
					title: '请稍后',
				});
				setTimeout(() => {
					let token = uni.getStorageSync('userInfo')['token'];
					let req = {
						token: token,
						orderMainIds: [id],
					};
					console.log(index);
					console.log(this.navList[index].orderList);
					this.$api.api.delOrder(req).then((res) => {
						if ((res.data.code = this.$status.req_suc)) {
							this.navList[index].orderList.splice(idx, 1);
						}
					});
					uni.hideLoading();
				}, 600);
			},
			// 申请退款
			RequestReturn(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定退款了吗？',
					success: function(res) {
						if (res.confirm) {
							setTimeout(() => {
								that.$store.commit('saveRefund', item);
								uni.navigateTo({
									url: `/pages/order/ApplyForRefund`,
								});
							}, 600);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},
			tuiHuo() {
				uni.showModal({
					title: '提示',
					content: '确定退货了吗？',
					success: function(res) {
						if (res.confirm) {
							setTimeout(() => {
								uni.navigateTo({
									url: `/pages/order/returnGoods`,
								});
							}, 600);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},

			//取消订单
			cancelOrder(id, status, index, idx) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定不要了吗？',
					success: function(res) {
						if (res.confirm) {
							setTimeout(() => {
								let req = {
									id: id,
								};
								that.$api.api.cancelOrder(req).then((res) => {
									console.log(res);
									if (res.code == '000000') {
										that.navList[index].orderList.splice(idx, 1);
									} else {
										that.$api.msg(res.msg);
									}
									// if (res.data.code == this.$status.req_suc) {
									// 	uni.hideLoading();
									// 	this.navList[index].orderList[idx].status = 9
									// }
								});
							}, 600);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},

			// 确认收货
			confirm(id, index, idx) {
				uni.showModal({
					content: '确定收货',
					success: (res) => {
						if (res.confirm) {
							let req = {
								orderId: id,
								action: 'FinishOrder',
							};
							uni.showLoading({
								title: '确认收货中...',
							});
							setTimeout(() => {
								this.$api.api.FinishOrder(req).then((res) => {
									console.log(res);
									if (res.data.success == true) {
										uni.hideLoading();
										this.navList[index].orderList.splice(idx, 1);
									} else {
										uni.hideLoading();
										this.$api.msg(res.data.msg);
									}
								});
							}, 600);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},

			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#55BA6F';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待发货';
						break;
					case 9:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor,
				};
			},
			// 跳转退款页面
			jump(item) {
				let id = item.id;
				console.log(id);
				uni.navigateTo({
					url: `../returnRequest/returnRequest?id=${id}`,
				});
			},
		},
	};
</script>

<style lang="scss">
	.tip-container {
	  display: flex;
	  align-items: center;
	  padding: 24rpx 32rpx;
	  background-color: #fff9f9;
	  border: 2rpx solid #ffebee;
	  border-radius: 16rpx;
	  font-size: 128rx;
	  margin: 32rpx 0;
	}
	.color {
		color: #909399;
	}

	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: #323f6c;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #323f6c;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 0 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

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
					content: '';
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
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			display: flex;
			justify-content: flex-start;

			.right {
				width: 80%;
				color: #000;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.right-text {
					// width: 80rpx;
					// height: 40rpx;
					// line-height: 40rpx;
					// text-align: center;
					border-radius: 10rpx;
					color: #fff;
					background-color: #323f6c;
					margin-top: 20rpx;
					align-self: flex-end;
					padding: 0 30rpx;
				}
			}

			.goods-item {
				width: 160upx;
				height: 160upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
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
			margin-left: 24upx;
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

	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center;
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999;
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px;
	}

	.uni-load-more__img>view {
		position: absolute;
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: 0.2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite;
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0;
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0;
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px;
	}

	.activeys {
		background-color: #ffffff !important;
		color: #fa436a !important;
	}

	.load2 {
		transform: rotate(30deg);
	}

	.load3 {
		transform: rotate(60deg);
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s;
	}

	.load2 view:nth-child(1) {
		animation-delay: 0.13s;
	}

	.load3 view:nth-child(1) {
		animation-delay: 0.26s;
	}

	.load1 view:nth-child(2) {
		animation-delay: 0.39s;
	}

	.load2 view:nth-child(2) {
		animation-delay: 0.52s;
	}

	.load3 view:nth-child(2) {
		animation-delay: 0.65s;
	}

	.load1 view:nth-child(3) {
		animation-delay: 0.78s;
	}

	.load2 view:nth-child(3) {
		animation-delay: 0.91s;
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s;
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s;
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s;
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0.2;
		}
	}
</style>
