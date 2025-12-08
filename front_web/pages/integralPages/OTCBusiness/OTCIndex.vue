<template>
	<view>
		<view class="busRecord">
			<view class="busRecord-list">
				<view>全部交易</view>
				<view>用户</view>
				<view>商家</view>
				<view>币种</view>
				<view>状态</view>
			</view>
		</view>
		<view class="busRecord-list-box">
			<view class="list" @click="jump">
				<view class="lista">
					<text>订单时间：2020-04-28 01:43:22</text>
					<text style="color: #00C09F;font-size: 26rpx;">已完成</text>
				</view>
				<view class="lista">
					<text style="font-size: 28rpx;color: #223041;">买入-FC/CNY</text>
					<text>数量：9800.00 FC</text>
				</view>
				<view class="lista">
					<text>订单号：2020042801322</text>
					<text>单价：0.993CNY/FC</text>
				</view>
				<view class="list-footer">
					<view></view>
					<view class="footer-content"><text>总价：</text><text style="color: #223041;font-size: 28rpx;font-weight: bold;">989.111CNY</text></view>
				</view>
			</view>
			
			<view class="list">
				<view class="lista">
					<text>订单时间：2020-04-28 01:43:22</text>
					<text style="color: #00C09F;font-size: 26rpx;">已完成</text>
				</view>
				<view class="lista">
					<text style="font-size: 28rpx;color: #223041;">买入-FC/CNY</text>
					<text>数量：9800.00 FC</text>
				</view>
				<view class="lista">
					<text>订单号：2020042801322</text>
					<text>单价：0.993CNY/FC</text>
				</view>
				<view class="list-footer">
					<view></view>
					<view class="footer-content"><text>总价：</text><text style="color: #223041;font-size: 28rpx;font-weight: bold;">989.111CNY</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			jump(){
				uni.navigateTo({
					url:'/pages/integralPages/OTCBusiness/otcOrderDetail'
				})
			}
		}
	}
</script>

<style lang="scss">
	.busRecord{
		display: flex;
		height: 120rpx;
		align-items: center;
		padding: 0 30rpx;
		.busRecord-list{
			width: 100%;
			display: flex;
			justify-content: space-between;
			view{
				background-color: #E7EBF1;
				padding: 8rpx 22rpx;
				border-radius: 8rpx;
			}
		}
	}
	.busRecord-list-box{
		background-color: #F5F5F5;
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		padding: 15rpx 30rpx;
		flex-wrap: wrap;
		.list{
			box-shadow:0px 2px 4px 0px rgba(115,147,165,0.5);
			height: 267rpx;
			width: 710rpx;
			background-color: #FFFFFF;
			padding: 8rpx 16rpx;
			margin-bottom: 20rpx;
			.lista{
				display: flex;
				justify-content: space-between;
				padding: 6rpx 0;
				text{
					color: #8FA4BD;
					font-size: 24rpx;
				}
			}
		}
		.list-footer{
			display: flex;
			justify-content: space-between;
			border-top: 1rpx solid #E9E9E9;
			margin-top: 20rpx;
			.footer-content{
				color: #8FA4BD;
				font-size: 26rpx;
			}
		}
	}
</style>
