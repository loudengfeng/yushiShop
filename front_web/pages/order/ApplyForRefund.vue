<template>
	<view class="refund-box">
			<view class="refund-hd">
				<view class="img"><image :src="detail.ThumbnailsUrl" mode=""></image></view>
				<view class="refund-content">
					<view class="title">{{detail.ItemDescription}}</view>
					<text class="attr"
					      v-for="(itemgg,indexgg) in detail.arr"
					      :key="indexgg">{{itemgg.name}}:{{itemgg.list}}</text>
				</view>
			</view>
			<view class="clear">
				退款金额：<text>￥{{getPrice(detail.ItemListPrice)}}</text>
			</view>
		<view>
			<input class="input" type="text" v-model="Reason" placeholder="退款原因" placeholder-style="font-size:28rpx"/>
		</view>
		<view class="submit" @click="submit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Reason:'',
				detail:this.$store.state.saveRefund
			};
		},
		onLoad() {

		},
		methods:{
			getPrice(price){
				return price * this.detail.Quantity
			},
			async submit(){
				let param = {
					Reason:this.Reason,
					action:'RequestReturn',
					OrderItemID:this.detail.ID
				}
				let res = await this.$api.api.RequestReturn(param);
				if(res.data.status == true){
					this.$api.msg('提交成功，请耐心等待')
					setTimeout(function(){
						uni.navigateBack({
							delta:2
						})
					},1000)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.refund-box{
		> view{
			border-bottom: 2rpx solid #F5F5F5;
			padding: 20rpx 36rpx;
		}
		.refund-hd{
			overflow: hidden;
			display: flex;
			align-items: center;
			.img{
				float: left;
				image{
					width: 217rpx;
					height: 150rpx;
				}
			}
			.refund-content{
				float: left;
				margin-left: 30rpx;
				color: #818181;
				.title{
					font-size: 28rpx;
					font-weight: 500;
					color: #000;
				}
			}
		}
		.clear{
			clear: both;
		}
		.submit{
			position: fixed;
			bottom: -2rpx;
			width: 100%;
			height: 98rpx;
			background-color: #323F6C;
			color: #FFFFFF;
			text-align: center;
			font-size: 33rpx;
		}
		.input{
			font-size: 20rpx;
		}
	}
</style>
