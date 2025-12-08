<template>
	<view style="text-align: center;">
		<image :src="img" mode="" style="margin:  50rpx auto;"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img:''
			};
		},
		onLoad(options) {
			this.img = options.url
		}
	}
</script>

<style lang="scss">

</style>
