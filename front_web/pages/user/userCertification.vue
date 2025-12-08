<template>
	<view class="content" style="padding: 10rpx;">
			<view style="border: 1rpx dashed #555555;">
				<Signature ref="sig" v-model="contetentSign"></Signature>
			</view>
      <view class="yt-list" v-if="!flag">
        <view class="yt-list-cell b-b">
          <text class="cell-tit clamp">审核状态:</text>
          <text class="cell-tip">{{ getStauts(result.auditStatus)}}</text>
        </view>
		<view class="yt-list-cell b-b">
		  <text class="cell-tit clamp">原因:</text>
		  <text class="cell-tip">{{result.auditReason}}</text>
		</view>
		</view>
		<view v-if="!flag">
			<button :disabled="result.auditStatus == 1" class="add-btn"
			        @click="confirmA">重新提交</button>
		</view>
			<view v-else>
				<button class="add-btn"
				        @click="confirm">提交</button>
			</view>
	</view>
</template>

<script>
	import Signature from '@/components/sin-signature.vue'
	export default {
		data() {
			return {
				contetentSign: '',
				flag: true,
				result: {}
			}
		},
		components: {
			Signature,
		},
		onLoad() {
			
		},
		onShow() {
			this.getData()
		},
		methods: {
			getStauts(status){
				if(status == 2) {
					return '拒绝'
				}else if(status == 1){
					return '通过'
				}else{
					return '审核中'
				}
			},
			async getData(){
				let res = await this.$api.api.selectByTokenUserIdentity()
				if(res.code == '000000'){
					if(res.data){
						this.flag = false
						this.result = res.data
					}else{
						this.flag = true
					}
				}
			},
			async confirm() {
				// let s = await this.$refs.sig.getSyncSignature();
				// console.log('组件版本', this.$refs.sig.VERSION);
				// console.log('签名数据', s);
				let res = await this.$api.api.saveUserIdentity({nameSign: this.contetentSign})
				if(res.code== '000000'){
					this.$api.msg('提交成功')
					setTimeout(function () {
						uni.navigateBack()
					}, 400)
				}else{
					this.$api.msg(res.msg)
				}
			},
			async confirmA(){
				let res = await this.$api.api.saveUserIdentity({nameSign: this.contetentSign,id:this.result.id})
				if(res.code== '000000'){
					this.$api.msg('提交成功')
					setTimeout(function () {
						uni.navigateBack()
					}, 400)
				}else{
					this.$api.msg(res.msg)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.yt-list {
	  margin-top: 16upx;
	  background: #fff;
	}
	
	.yt-list-cell {
	  display: flex;
	  align-items: center;
	  padding: 10upx 30upx 10upx 40upx;
	  line-height: 70upx;
	  position: relative;
	
	  &.cell-hover {
	    background: #fafafa;
	  }
	
	  &.b-b:after {
	    left: 30upx;
	  }
	
	  .cell-icon {
	    height: 32upx;
	    width: 32upx;
	    font-size: 22upx;
	    color: #fff;
	    text-align: center;
	    line-height: 32upx;
	    background: #f85e52;
	    border-radius: 4upx;
	    margin-right: 12upx;
	
	    &.hb {
	      background: #ffaa0e;
	    }
	
	    &.lpk {
	      background: #3ab54a;
	    }
	  }
	
	  .cell-more {
	    align-self: center;
	    font-size: 24upx;
	    color: $font-color-light;
	    margin-left: 8upx;
	    margin-right: -10upx;
	  }
	
	  .cell-tit {
	    flex: 1;
	    font-size: 26upx;
	    color: $font-color-light;
	    margin-right: 10upx;
	  }
	
	  .cell-tip {
	    font-size: 26upx;
	    color: $font-color-dark;
	
	    &.disabled {
	      color: $font-color-light;
	    }
	
	    &.active {
	      color: $base-color;
	    }
	
	    &.red {
	      color: $base-color;
	    }
	  }
	
	  &.desc-cell {
	    .cell-tit {
	      max-width: 90upx;
	    }
	  }
	
	  .desc {
	    flex: 1;
	    font-size: $font-base;
	    color: $font-color-dark;
	  }
	}
	.add-btn {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 690upx;
	  height: 80upx;
	  margin: 60upx auto;
	  font-size: $font-lg;
	  color: #fff;
	  background-color: #323f6c;
	  border-radius: 10upx;
	  box-shadow: 1px 2px 5px rgba(50, 63, 108, 0.4);
	}
</style>