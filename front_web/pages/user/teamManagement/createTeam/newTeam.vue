<template>
	<view class="team-wrap">
		<view class="team-hd">团队名称（设置后可修改）</view>
		<view class="img">
			<image src="../../../../static/temp/camera.png" mode=""></image>
		</view>
		<view class="submit">完成</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.team-wrap{
	.team-hd{
		width:707rpx;
		height:82rpx;
		background:rgba(244,244,244,1);
		color: #A6A6A6;
		font-size: 28rpx;
		text-align: center;
		line-height: 82rpx;
		margin: 36rpx auto;
	}
	.img{
		margin-top: 140rpx;
		display: flex;
		justify-content: center;
		image{
			height: 168rpx;
			width: 208rpx;
		}
	}
	.submit{
		width:711rpx;
		height:82rpx;
		background:rgba(34,48,65,1);
		border-radius:9rpx;
		color: #223041;
		margin: 146rpx auto 0;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		line-height: 82rpx;
	}
}
</style>
