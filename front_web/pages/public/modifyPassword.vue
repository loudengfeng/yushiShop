<template>

	<view class="find_psw">
		<form @submit="formSubmit" class="form1">
			<input type="password"  placeholder="请输入旧密码" class="newpassword1" v-model="oldPassword"/>
			<input type="password"  placeholder="请输入登录密码" class="newpassword1" v-model="newpassword1"/>
			<input type="password"  placeholder="确认密码" class="newpassword2" v-model="newpassword2"/>
			<button class="finish" formType="submit">完成</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone1:'',//手机号
				newpassword1:'',//登录密码
				newpassword2:'',//确认密码
				oldPassword:'',
				type:'',
			};
		},
		onLoad() {
			// this.type = this.$status.document_type.register;
		},
		methods:{
			// agreelaw:function(){
			// 	this.agree = !this.agree
			// },
			// agree_con(){
			// 	uni.navigateTo({
			// 		url: '../Agreement/Agreement?type='+this.type
			// 	});
			// },

			formSubmit: function(e) {
				var that= this
				if(this.oldPassword.length < 6){
					uni.showToast({ title: '密码最短为 6 个字符', icon : "none"});
					return false;
				}
				if(this.newpassword1.length<6){
					uni.showToast({ title: '密码最短为 6 个字符', icon : "none"});
					return false;
				}
				if(this.newpassword1 != this.newpassword2){
					uni.showToast({ title: '两次输入的密码不一样', icon : "none"});
					return false;
				}
				let pp = {
					Password:this.newpassword1,
					OldPassword:this.oldPassword,
				}
				let cc = JSON.stringify(pp)
				let params= {
					data:cc,
					action:'UpdatePassword'
				}
				this.$api.api.sendcode(params).then((res)=>{
					if(res.data.status== true){
						uni.showToast({
							title:'修改成功成功',
							icon: 'none'
						});
						setTimeout(function(){
							uni.navigateTo({
								url:'/pages/public/login'
							})
						},500)
					}else{
						uni.showToast({ title: res.data.message, icon : "none"});
					}
				})
			}	
		}	
	}
</script>

<style>
	button::after{
		margin: 0;
		padding: 0;
		border: 1px solid transparent;
		outline: none;   
	}
	.find_psw{
		padding-top: 50upx;
		position: relative;
		overflow-y: hidden;
	}
	.phone1, .newpassword1,.newpassword2{
		font-size: 28upx;
		height: 100upx;
		width: 668upx;
		margin-left: 52upx;
		border-bottom: 2upx solid rgba(220,220,220,1);
	}
	.code{
		font-size: 28upx;
		height: 100upx;
		width: 668upx;
		margin-left: 52upx;
		border-bottom: 2upx solid rgba(220,220,220,1);
		position: relative;
	}
	.code1{
		height: 100upx;
		width: 60%;
		position: absolute;
		font-size: 28rpx;
	}
	.getcode{
		width:160upx;
		height:55upx;
		line-height: 48upx;
		text-align: center;
		font-size: 26upx;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:#323F6C;
		border:2px solid #323F6C;
		border-radius:10px;
		position: absolute;
		right: 12upx;
		top: 27.5upx;
	}
	.treaty{
		font-size: 24upx;
		margin-top: 30upx;
		margin-left: 52upx;
	}
	.finish{
		height: 88upx;
		width: 690upx;
		margin: 480upx auto 0;
	    border-radius: 40upx;
		background-color: #323F6C;
		color: #fff;
	}
</style>
