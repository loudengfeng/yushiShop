<template>
	<view class="container">
		<view >
			<!-- <view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">实名认证</text>
				<text class="cell-more yticon icon-you"></text>
			</view> -->
			<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50" @click="navTo('/pages/public/modifyPassword')">
				<text class="cell-tit">修改登录密码</text>
				<text class="cell-more yticon icon-you"></text>
			</view>
			<!-- <view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50" >
				<text class="cell-tit">修改手机号</text>
				<text>{{phoneName}}</text>
			</view> -->
		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				hasLogin: '',
				phoneName:''
			};
		},
		onShow() {
			this.hasLogin = uni.getStorageSync('token')
			this.phoneName = uni.getStorageSync('phone').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || uni.getStorageSync('phone')
		},
		methods: {
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url,
				});
			},

		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			/* margin-top: 16upx; */
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
