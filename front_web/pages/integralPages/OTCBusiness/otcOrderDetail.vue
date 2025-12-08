<template>
	<view class="order-wrap">
		<view class="order-people">
			<view class="people-1">
				<view class="name">对方名称</view>
				<view class="color"><text class="color-left">近30日成交</text><text style="color: #000000;">23</text></view>
			</view>
			<view class="people-2">
				<view>0</view>
				<view style="color: #BBBBBB;">近30日申诉</view>
			</view>
			<view class="people-3">
				<view>0</view>
				<view style="color: #BBBBBB;">近30日胜诉</view>
			</view>
			<view class="people-4"><image src="../../../static/vip/right.png" mode=""></image></view>
		</view>
		<view class="order-hd">
			<view class="first">
				<text>交易金额</text>
				<text>订单号：{{detail.FishOrderId}}</text>
			</view>
			<view class="second">
				<view><text style="color: #C34554;font-size: 32rpx;margin-right: 4rpx;">1455.33</text><text>CNY</text></view>
				<view style="color: #00C09F;font-size: 30rpx;">{{detail.OrderStatus}}</view>
			</view>
			<view class="three">
				<text>售出数量：</text>
				<text style="font-size: 32rpx;color: #283849;">{{detail.FishNumber}}</text>
				<text>FC</text>
			</view>
			<view class="three">
				<text>获得金额</text>
				<text style="font-size: 32rpx;color: #283849;">141414.11</text>
				<text>CNY/FC</text>
			</view>
		</view>
		<view class="ok">
			<view>
				<!-- <image src="../../../static/selected.png" mode=""></image> -->
				<image src="" mode=""></image>
				<!-- <view>订单交易完成</view> -->
				<view>如该订单有疑问可联系现在客服</view>
			</view>
		</view>
		<view class="order-btn">
			<view class="btn1"><image src="../../../static/delete.png" mode=""></image><text>联系卖家</text></view>
			<view class="btn2" @click="jump()">返回积分页面</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:''
			};
		},
		onLoad(options) {
			let id = options.orderId
			this.getOrderDetail(id)
		},
		methods:{
			async getOrderDetail(id){
				let data = {
					FishOrderId:id
				}
				let StringData = JSON.stringify(data)
				let params = {
					action:'ReadFishOrder',
					data:StringData
				}
				let res = await this.$api.api.getFish(params)
				if(res.data.status == true){
					this.detail = res.data.data[0]
					if(this.detail.OrderStatus == 0){
						this.detail.OrderStatus = '待接单'
					}if(this.detail.OrderStatus == 1){
						this.detail.OrderStatus = '未支付'
					}if(this.detail.OrderStatus == 2){
						this.detail.OrderStatus = '已支付'
					}if(this.detail.OrderStatus == 10){
						this.detail.OrderStatus = '完成'
					}if(this.detail.OrderStatus == 11){
						this.detail.OrderStatus = '取消'
					}if(this.detail.OrderStatus == 12){
						this.detail.OrderStatus = '申诉中'
					}if(this.detail.OrderStatus == 13){
						this.detail.OrderStatus = '拒绝接单'
					}if(this.detail.OrderStatus == 14){
						this.detail.OrderStatus = '接单超时'
					}
				}
			},
			jump(){
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.order-people{
		width: 100%;
		display: flex;
		padding: 30rpx 0;
		align-items: center;
		.people-1{
			flex: 1.5;
			text-align: center;
			.name{
				font-size: 37rpx;
				color: #5B8ECD;
			}
			.color{
				font-size: 28rpx;
				color: #ACACAC;
				.color-left{
					margin-right: 30rpx;
				}
			}
		}
		.people-2{
			flex: 1;
			text-align: center;
		}
		.people-3{
			flex: 1;
			text-align: center;
		}
		.people-4{
			flex: 0.4;
			image{
				width: 38rpx;
				height: 36rpx;
			}
		}
	}
.order-hd{
	// height: 243rpx;
	width: 100%;
	padding: 22rpx;
	border-bottom:20rpx solid #F5F5F5;
	border-top:20rpx solid #F5F5F5;
	.first{
		display: flex;
		color: #BBBBBB;
		font-size: 28rpx;
		justify-content: space-between;
	}
	.second{
		display: flex;
		justify-content: space-between;
		> view{
			font-size: 28rpx;
			color: #BBBBBB;
		}
	}
	.three{
		font-size: 28rpx;
		color: #BBBBBB;
		> text{
			margin-right: 10rpx;
		}
	}
}
.ok{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 500rpx;
	> view{
		text-align: center;
	}
	image{
		height: 98rpx;
		width: 98rpx;
	}
}
.order-btn{
	position: fixed;
	bottom: 0rpx;
	height: 124rpx;
	width: 100%;
	display: flex;
	> view{
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			height: 48rpx;
			width: 48rpx;
		}
	}
	.btn1{
		flex: 4;
		background-color: #EFF3F6;
		font-size: 34rpx;
		color: #283849;
		margin-left: 10rpx;
	}
	.btn2{
		flex: 6;
		color: #FFFFFF;
		font-size: 34rpx;
		background-color: #5A6771;
	}
}
</style>
