<template>
	<view class="find_psw">
		<form @submit="loginNow" class="form1">
			<input type="number"  placeholder="请输注册手机号" maxlength="11" class="phone2"  v-model="phone"/>
			<view class="code">
				<input type="number" v-model="code" maxlength="6" placeholder="请输入验证码" class="code1"/><text class="getcode" @click="send" v-model="code">{{getcode}}</text>
			</view>
			<view class="find_psw">
					<input type="password" v-model="newpsw" placeholder="请输入新密码" class="newpassword1"/>
					<input type="password" v-model="newpsw1" placeholder="再次输入新密码" class="newpassword2"/>
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
				phone:'',//输入手机号
				code:'',//验证码
				newpsw:'',//输入新密码
				newpsw1:'',//再次输入
				getcode:'获取验证码',
				countNum:60,//倒计时
				timer:null
			};
		},
		onLoad:function() {
			_self =this
		},
		methods:{
			async send(){
				var myreg=/^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.phone)){
					uni.showToast({ title: '请正确填写手机号码', icon : "none"});
				    return false;
				}
				if (this.getcode != '获取验证码' && this.getcode != '重新发送'){return ;}
				this.getcode =  "发送中...";
				// 倒计时
				this.countNum = 60;
				this.timer = setInterval(function(){this.countDown();}.bind(this), 1000);
				let res = await this.$api.api.sendcode({phone:this.phone,action:'GetCode'});
				uni.hideLoading();
				if(res.data.status != true){
					uni.showToast({
						title:res.data.message,
						icon:"none"
					})
				}
				else{
					 uni.showToast({
						title:'发送成功',
					})
				}
			},
			countDown : function(){
				if (this.countNum < 1){
				  clearInterval(this.timer);
				  this.getcode = "重新发送";
				  return ;
				}
				this.countNum--;
				this.getcode =  this.countNum + '秒重发';
			},
			loginNow: function() {
				this.$api.api.forgetPassword({phone:this.phone,password:this.newpsw,code:this.code,
				action:'RetrievePassword',type:1
				}).then((res)=>{
					console.log(res)
					if(res.data.status != true){
						uni.showToast({
							title:res.data.message,
							icon:"none"
						})
					}
					else{
						this.$api.msg('修改密码成功')
						setTimeout(function(){
							uni.navigateTo({
								url:'/pages/public/login'
							});
						},800)
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
	.phone2, .code{
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
	.btn_next{
		height: 88upx;
		width: 690upx;
		margin: 120upx auto;
	    border-radius: 40upx;
		background-color: #0A94ED;
		color: #fff;
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
