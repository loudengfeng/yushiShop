<template>
	<view class="find_psw">
		<form @submit="loginNow" class="form1">
			<view class="find_psw">
					<input type="text" v-model="newpsw" placeholder="请输入6位数字的密码" class="newpassword1"  maxlength="6"/>
					<input type="text" v-model="newpsw1" placeholder="再次输入交易密码" class="newpassword2" maxlength="6"/>
					<button class="finish" formType="submit">完成</button>
			</view>
		</form>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				newpsw:'',//输入新密码
				newpsw1:''//再次输入
			};
		},
		onLoad:function() {
			_self =this
		},
		methods:{
			loginNow: function() {
				let param ={
					action:'SetTradePassword',
					TradePassword:this.newpsw1
				}
				if(this.newpsw.length<6){
					uni.showToast({ title: '密码为 6 个字符', icon : "none"});
					return false;
				}
				if(this.newpsw1 != this.newpsw){
					uni.showToast({ title: '两次输入的密码不一样', icon : "none"});
					return false;
				}
				this.$api.api.forgetPassword(param).then((res)=>{
					console.log(res)
					if(res.data.status == true){
						uni.showToast({
							title:res.data.message,
							icon:"none"
						})
						setTimeout(function(){
							uni.navigateBack({
								
							})
						},800)
					}else{
						this.$api.msg(res.data.message)
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
	page{
		overflow: hidden;
	}
	.find_psw{
		position: relative;
	}
	.btn_next{
		height: 88upx;
		width: 690upx;
		margin: 120upx auto;
	    border-radius: 40upx;
		background-color: #0A94ED;
		color: #fff;
	}
	
	.phone1, .newpassword1,.newpassword2{
		font-size: 28upx;
		height: 100upx;
		width: 668upx;
		margin-left: 52upx;
		border-bottom: 2upx solid rgba(220,220,220,1);
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
