<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="http"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				http:'https://m.kuaidi100.com/app/query/?coname=indexall&openid=ofaKJv_JyF4p70emxlWxSklv8SDE'
			};
		},
		onLoad(options) {
			let code = options.code;
			let name = options.name;
			let callbackurl = "http://xdkb2c.gup-group.cn/" + '/pages/order/order?state=3'
			this.http = this.http + '&nu='+code +'&com=' +name+'&callbackurl='+callbackurl
		}
	}
</script>

<style lang="scss">

</style>
