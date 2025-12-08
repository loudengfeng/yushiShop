<template>
	<view class="content">
		<view class="bac">
			<view class="content-f">
				<text :class="itemTabs.checked ? 'cur-text' : ''" v-for="(itemTabs, indexTabs) in tabs" :key="indexTabs" @click="chooseTabs(indexTabs)">{{ itemTabs.name }}</text>
			</view>
		</view>
		<Buy v-if="buyFlag" ref="buyWay" @chooseTab="chooseTab" />
		<Sell v-if="sellFlag" ref="sellWay" @chooseTab="chooseTab" />
		<!-- <OTC v-if = '!tabFlag'></OTC> -->
		<view v-if="orderFlag">
			<view class="order-title">
				<view class="order-title-copy" @click="stateOpen">
					<view>全部状态</view>
					<image src="/static/blew.png"></image>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list-box" v-for="(item, index) in oldList[0].orderList" :key="index" @click="jump(item.FishOrderId)">
				<view class="list-hd">
					
					<view class="list-hd-left"><text>委托单号:</text><text>{{ item.FishOrderId }}</text></view>
					<view class="list-hd-right detail" style="color: #515151;margin-top: 0rpx;" @click.stop="cancel(item.FishOrderId,index)">取消订单</view>
				</view>
				<view class="list-detail">
					<view><text :class="item.TransactionType == '买入' ? '' : 'sell'">{{ item.TransactionType }}+FC/CNY </text><text style="margin-left: 10rpx;color: #343434;" v-if="item.TransactionType == '卖出'">收款方式: （{{getPay(item.AcceptPayWay)}}）</text><text style="margin-left: 10rpx;color: #343434;" v-else>支付方式: （{{getPay(item.AcceptPayWay)}}）</text></view>
					<view style="border: none;" class="detail" v-if="item.OrderStatus == '未支付' || item.OrderStatus == '已支付' || item.OrderStatus == '申诉中'">未完成</view>
					<view style="border: none;" class="detail" v-if="item.OrderStatus == '完成' || item.OrderStatus == '接单超时' || item.OrderStatus == '取消'">完成</view>
				</view>
				<view class="list-img">
					<view>
						<image :src="item.UserHead" mode=""></image>
						<text style="margin-left: 35rpx; font-size: 28rpx; color: #223041;">{{ item.UserBindName }}</text>
					</view>
					<view style="color: #aeaeae; font-size: 28rpx;">{{
            item.CreateDate
          }}</view>
				</view>
				<view class="list-list">
					<view style="text-align: center;">
						<view>数量（FC）</view>
						<view style="color: #000000;">{{ item.FishNumber }}</view>
					</view>
					<view style="text-align: center;">
						<view>单价（￥）</view>
						<view>{{ item.FishPrice }}</view>
					</view>
					<view style="text-align: center;">
						<view>总金额（￥）</view>
						<view>{{ item.total }}</view>
					</view>
				</view>
			</view>
			<uniLoadMore :status="oldList[0].loadingType"></uniLoadMore>
		</view>
		<Footer :num="num"></Footer>
		<!-- 全部状态的弹出框区域 -->
		<uniPopup ref="statePopup" type="top">
			<view class="popup-box">
				<!-- 筛选区域 -->
				<view class="screen">
					<!-- 筛选的左边 -->
				</view>
				<view class="order-title">
					<view class="order-title-copy" @click="stateOpen">
						<view>全部状态</view>
						<image src="/static/blew.png"></image>
					</view>
				</view>
				<!-- 状态订单 -->
				<view>
					<view class="status">委买/委卖</view>
					<view class="state-List">
						<view class="state-item" v-for="(stateItem, stateIndex) in orderList" :key="stateIndex" :class="stateCruuent == stateItem.index ? 'stateActive' : ''"
						 @click="changeState(stateItem.oId, stateIndex)">{{ stateItem.text }}</view>
					</view>
				</view>
				<!--  -->
				<view>
					<view class="status">状态管理</view>
					<view class="state-List">
						<view class="state-item" v-for="(ordeItem, ordeIndex) in orderStatus" :key="ordeIndex" :class="statusCruuent == ordeItem.index ? 'stateActive' : ''"
						 @click="changeStatus(ordeItem.oId, ordeIndex)">{{ ordeItem.text }}</view>
					</view>
				</view>
				<view class="screen-footer">
				  <view class="screen-reset"
				        @click="screenReset">重置</view>
				  <view class="screen-screen"
				        @click="screenDetermine">筛选</view>
				</view>
			</view>
		</uniPopup>
	</view>
</template>

<script>
	import Buy from './buy';
	import Sell from './sell';
	import OTC from './OTCIndex';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import Footer from '@/components/footer.vue';
	export default {
		components: {
			Buy,
			Sell,
			OTC,
			uniPopup,
			uniLoadMore,
			Footer
		},
		data() {
			return {
				num: 4,
				tabs: [{
						name: '买币',
						checked: true,
					},
					{
						name: '卖币',
						checked: false,
					},
					{
						name: '委托列表',
						checked: false,
					},
				],
				orderStatus: [{
						id: '',
						text: "全部",
						index:0
					},
					{
						id: 0,
						text: "未完成",
						index:1
					},
					{
						id: 10,
						text: "完成",
						index:2
					}
				],
				// 订单的全部状态的数据
				orderList: [{
						oId: '',
						text: '全部',
						index: 0,
					},
					{
						oId: 'false',
						text: '委买列表',
						index: 1,
					},
					{
						oId: "true",
						text: '委卖列表',
						index: 2,
					}
				],
				oldList: [{
					id: 2,
					text: '订单',
					loadingType: 'more',
					orderList: [],
					start: 0,
					total: null,
				}, ],
				buyFlag: true,
				sellFlag: false,
				orderFlag: false,
				stateCruuent: '0',
				statusCruuent: '0',
				OrderStatus: '', //(0待接单1未支付2已支付10完成11取消12申诉中13拒绝接单14接单超时)
				status:""
			};
		},
		onShow() {
			this.getCard();
		},
		onReachBottom() {
			if (this.orderFlag) {
				this.getData();
			}
		},
		methods: {
			getPay(index){
				let arr = JSON.parse(index)
				console.log(arr[0])
				if(arr[0] == 12){
					return "微信"
				}
				if(arr[0] == 10){
					return "银行卡"
				}
				if(arr[0] == 11){
					return "支付宝"
				}if(arr[0] == 2){
					return "余额"
				}
			},
			// 筛选的重置按钮
			screenReset() {
			  this.stateCruuent = 0;
			  this.statusCruuent = 0;
			  this.oldList[0].orderList = [];
			  this.oldList[0].start = 0;
			  this.oldList[0].total = null;
			  this.getData();
			  this.$refs.popup.close();
			},
			// 筛选
			screenDetermine() {
			  // this.stateCruuent = index;
			  // this.OrderStatus = this.orderList[index].oId;
			  this.oldList[0].orderList = [];
			  this.oldList[0].start = 0;
			  this.oldList[0].total = null;
			  this.getData();
			  this.$refs.statePopup.close();
			},
			// 取消订单
			async cancel(id, index) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要取消订单吗',
					success: (res) => {
						if (res.confirm) {
							this.okCancel(id, index)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			async okCancel(id, index) {
				let data = {
					FishOrderId: id
				}
				let StringData = JSON.stringify(data)
				let param = {
					action: "CancelFishOrder",
					data: StringData
				}
				let res = await this.$api.api.getFish(param)
				if (res.data.status == true) {
					this.oldList[0].orderList.splice(index, 1)
				} else {
					this.$api.msg(res.data.message)
				}
			},
			chooseTab(val) {
				this.sellFlag = false
				this.buyFlag = false
				this.orderFlag = true
				for (var i in this.tabs) {
					var obj = this.tabs[i];
					obj.checked = 2 == i;
				}
				this.oldList[0].orderList = [];
				this.oldList[0].start = 0;
				this.oldList[0].total = null;
				this.getData();
			},
			jumpXQ(id, flag) {
				if (!flag) {
					uni.navigateTo({
						url: './payInfo?orderId=' + id,
					});
				} else {
					uni.navigateTo({
						url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
							id,
					});
				}
			},
			getCard() {
				this.$nextTick(function() {
					this.$refs.buyWay.getPayWay();
				});
			},
			jump(id) {
				uni.navigateTo({
					url: './orderDetailPage?id=' + id,
				});
			},
			async getData() {
				let start = this.oldList[0].start;
				let index = 0;
				let type = index;
				let data = ""
				if(this.status){
					data = {
						Offset: Math.ceil(start / 10), //页面
						RowNumber: 10, //条数
						TransactionType: this.OrderStatus,
						Captain: 0,
						OrderStatus:this.status,
						OrderByKey:'LastTradeTime'
					};
				}else{
					data = {
						Offset: Math.ceil(start / 10), //页面
						RowNumber: 10, //条数
						TransactionType: this.OrderStatus,
						Captain: 0,
						OrderByKey:'LastTradeTime'
					};
				}
				let stringData = JSON.stringify(data);
				let param = {
					action: 'ReadFishOrder',
					data: stringData,
				};
				let res = await this.$api.api.getFish(param);
				if (res.data.status == true) {
					res.data.data.forEach((item, index) => {
						if (item.TransactionType) {
							//false买否则卖
							item.TransactionType = '卖出';
						} else {
							item.TransactionType = '买入';
						}
						if (item.UserBindName) {
						  item.UserBindName = item.UserBindName.replace(
						    /(\d{3})\d{4}(\d{4})/,
						    '$1****$2'
						  );
						}
						if (item.SellerUserBindName) {
						  item.SellerUserBindName = item.SellerUserBindName.replace(
						    /(\d{3})\d{4}(\d{4})/,
						    '$1****$2'
						  );
						}
						item.FishPrice = Number(item.FishPrice).toFixed(2);
						item.FishNumber = Number(item.FishNumber).toFixed(2);
						item.total = Number(item.FishPrice * item.FishNumber).toFixed(2);
						if (item.OrderStatus == 0) {
							item.OrderStatus = '未支付';
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
							item.OrderStatus = '申诉中';
						}
						if (item.OrderStatus == 13) {
							item.OrderStatus = '拒绝接单';
						}
						if (item.OrderStatus == 14) {
							item.OrderStatus = '接单超时';
						}
					});
					this.oldList[0].total = res.data.sum;
					this.oldList[0].start += res.data.data.length;
					this.oldList[0].orderList = this.oldList[0].orderList.concat(
						res.data.data
					);
					this.oldList[0].loadingType =
						this.oldList[0].total > this.oldList[0].start ? 'more' : 'nomore';
				}
			},
			// 点击打开全部状态的弹出框
			stateOpen() {
				this.$refs.statePopup.open();
			},
			// 全部状态的选中项的的改变
			changeState(id, index) {
				this.stateCruuent = index;
				this.OrderStatus = this.orderList[index].oId;
			},
			changeStatus(id,index){
				this.statusCruuent = index;
				this.status = this.orderStatus[index].id;
			},
			chooseTabs(index) {
				for (var i in this.tabs) {
					var obj = this.tabs[i];
					obj.checked = index == i;
				}
				if (index == 0) {
					this.buyFlag = true;
					this.sellFlag = false;
					this.orderFlag = false;
					this.$nextTick(function() {
						this.$refs.buyWay.getPayWay();
					});
				} else if (index == 1) {
					this.buyFlag = false;
					this.sellFlag = true;
					this.orderFlag = false;
					this.$nextTick(function() {
						this.$refs.sellWay.getPayWay();
					});
				} else if (index == 2) {
					this.buyFlag = false;
					this.sellFlag = false;
					this.orderFlag = true;
					this.oldList[0].orderList = [];
					this.oldList[0].start = 0;
					this.oldList[0].total = null;
					this.getData();
				}
			},
		},
	};
</script>

<style lang="scss">
	.sell {
		color: #52B88A !important;
	}
	.status{
		padding-left: 20rpx;
	}
	
	.screen-footer {
	  display: flex;
	  justify-content: space-evenly;
	  padding-bottom: 26rpx;
	
	  > view {
	    width: 333rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    text-align: center;
	    font-size: 30rpx;
	    font-weight: 600;
	    border-radius: 2rpx;
	  }
	
	  .screen-reset {
	    color: #223041;
	    background-color: #dae0e7;
	  }
	
	  .screen-screen {
	    color: #fff;
	    background-color: #223041;
	  }
	}

	.detail {
		font-size: #515151;
		font-size: 26rpx;
		width: 144rpx;
		height: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1rpx solid #979797;
		border-radius: 25rpx;
		color: #515151;
		margin-top: 18rpx;
	}

	.list-box {
		padding: 20rpx 5%;
		border-bottom: 15rpx solid #f5f5f5;

		.list-hd {
			display: flex;
			justify-content: space-between;

			.list-hd-left {
				font-size: 26rpx;
				color: #343434;
			}

			.list-hd-right {
				font-size: 28rpx;
				color: #f9bb62;
			}
		}

		.list-detail {
			font-size: 32rpx;
			color: #c34554;
			display: flex;
			justify-content: space-between;
		}

		.list-img {
			display: flex;
			justify-content: space-between;

			>view {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
			}

			image {
				height: 68rpx;
				width: 68rpx;
			}
		}

		.list-list {
			display: flex;
			justify-content: space-between;
			margin-top: 15rpx;

			view {
				&:nth-child(1) {
					color: #787878;
					font-size: 28rpx;
					text-align: center;
				}
			}
		}
	}

	.common-flex {
		display: flex;
		justify-content: space-between;
	}

	// 状态区域
	.order-title {
		height: 84rpx;
		display: flex;
		align-items: center;
		background-color: #f5f5f5;

		.order-title-copy {
			padding: 20rpx 40rpx;
			display: flex;
			align-items: center;

			>view {
				font-weight: 700;
				color: #223041;
				margin-right: 15rpx;
			}

			>image {
				width: 21rpx;
				height: 21rpx;
			}
		}
	}

	// 全部状态弹出框
	.popup-box {

		// 状态区域
		.order-title {
			height: 84rpx;
			display: flex;
			align-items: center;
			background-color: #f5f5f5;

			.order-title-copy {
				padding: 20rpx 40rpx;
				display: flex;
				align-items: center;

				>view {
					font-weight: 700;
					color: #223041;
					margin-right: 15rpx;
				}

				>image {
					width: 21rpx;
					height: 21rpx;
				}
			}
		}

		.state-List {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx;

			.state-item {
				width: 215rpx;
				height: 80rpx;
				margin: 10rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: #f4f4f4;
				border: 1rpx solid transparent;
			}

			// 全部状态的选中项
			.stateActive {
				border: 1rpx solid #c34554 !important;
				color: #c34554 !important;
			}
		}
	}

	// 筛选弹出框区域
	.popup-box {
		background-color: #fff;

		// 筛选区域的支付方式默认选中项
		.paymentActive {
			border: 1rpx solid #c34554 !important;
			color: #c34554 !important;
		}

		.screen-box {
			padding: 30rpx;

			.payment-method {
				color: #223041;
				font-size: 30rpx;
			}

			.payment-name {
				display: flex;

				>view {
					font-size: 24rpx;
					margin: 20rpx;
					width: 140rpx;
					height: 66rpx;
					line-height: 66rpx;
					text-align: center;
					background-color: #f3f3f3;
					border-radius: 10rpx;
					border: 1rpx solid transparent;
					position: relative;

					>image {
						position: absolute;
						bottom: 0;
						right: 0;
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}

		.screen-footer {
			display: flex;
			justify-content: space-evenly;
			padding-bottom: 62rpx;

			>view {
				width: 333rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: 600;
				border-radius: 2rpx;
			}

			.screen-reset {
				color: #223041;
				background-color: #dae0e7;
			}

			.screen-screen {
				color: #fff;
				background-color: #223041;
			}
		}
	}

	.bac {
		background-color: #223041;
		width: 100%;
		height: 70rpx;
		position: relative;

		.content-f {
			position: absolute;
			bottom: 0rpx;
			display: flex;
			justify-content: space-evenly;
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;

			text {
				display: inline-block;
				height: 100%;
				line-height: 100%;
				color: #acacac;
			}

			.cur-text {
				color: #c34554;
				border-bottom: 6rpx solid #c34554;
			}
		}
	}

	.content-t {
		position: absolute;
		left: 25%;

		display: flex;
		align-items: center;
		justify-content: space-evenly;
		width: 400rpx;
		height: 60rpx;
		border: 1rpx solid #c34554;
		border-radius: 10rpx;
		margin-top: 14rpx;

		>view {
			width: 100%;
			height: 100%;
			color: #fff;

			text-align: center;
		}

		.cur {
			background-color: #c34554;
		}
	}
</style>
