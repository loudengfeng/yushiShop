import http from './interface'
/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
// export const test = (data) => {
// 	 http.config.baseUrl = "http://szw.ngrok.gdcome.com:81/"
// 	//设置请求前拦截器
// var token = uni.getStorageSync('token')
// http.interceptor.request = (config) => {
// 	console.log(config)
// 	return config;
// }
// 	//设置请求结束后拦截器
// 	http.interceptor.response = (response) => {
// 		console.log(response)
// 		//判断返回状态 执行相应操作
// 		return response;
// 	}
// 	return http.request({
// 		baseUrl: 'http://szw.ngrok.gdcome.com:81/',
// 		url: '',
// 		dataType: 'text',
// 		data
// 	})
// }

// 登录
export const login = (data) => {
	return http.post("toc/auth/login", data)
}
// 获取商品列表数据
export const productList = (data) => {
	return http.post('toc/product/list', data)
}
// 商品详情
export const productDetail = (data) => {
	return http.get('toc/product/detail', data)
}
// 得到用户信息
export const getUserInfo = (data) => {
	return http.get("toc/user/getUser", data)
}
// 保存收获地址
export const saveUserAddr = (data) => {
	return http.post("toc/userAddr/save", data)
}
// 我的收获地址
export const userAddrSelectByUserId = (data) => {
	return http.get("toc/userAddr/selectByUserId", data)
}
// 删除地址
export const userAddrDeleteById = (data) => {
	return http.pic_post("toc/userAddr/deleteById", data)
}
//我的订单
export const orderList = (data) => {
	return http.post("toc/order/list", data)
}
//创建订单
export const createOrder = (data) => {
	return http.post("toc/order/create", data)
}
//支付订单
export const uploadPaymentProof = (data) => {
	return http.post("toc/order/uploadPaymentProof", data)
}
//取消订单
export const cancelOrder = (data) => {
	return http.pic_post("toc/order/cancel", data)
}
//保存签名码
export const saveUserIdentity = (data) => {
	return http.post("toc/userIdentity/save", data)
}
//绑定收款方式
export const saveUserPaymentCode = (data) => {
	return http.post("toc/userPaymentCode/save", data)
}
//查看收款信息
export const userPaymentCode = (data) => {
	return http.post("toc/userPaymentCode/selectByToken", data)
}
//根据订单查看详情
export const orderDetail = (data) => {
	return http.pic_post("toc/order/detail", data)
}
//我的仓库
export const productMyList = (data) => {
	return http.post("toc/product/myList", data)
}
export const selectByTokenUserIdentity = (data) => {
	return http.post("toc/userIdentity/selectByToken", data)
}



//忘记密码
export const forgetPassword = (data) => {
	return http.post("api/MembersAPI.ashx", data)
}
//获取轮图
export const swiper = (data) => {
	return http.post("api/SysAPI.ashx", data)
}
//登出
export const logout = (data) => {
	return http.post("api/MembersAPI.ashx", data)
}
//获取一级菜单
export const frist = (data) => {
	return http.post("api/ProductsAPI.ashx", data)
}
// 获取商品详情
export const shopDetails = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
// 判断是否收藏
export const isCollect = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
// 加入收藏
export const collection = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
// 取消收藏
export const cancelCollection = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
// 获取首页分类数据
export const homeCategoriesList = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
// 获取商品规格数据
export const sKUAttributes = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
//新增地址
export const submitAddress = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
//获取收货列表地址
export const getAddresList = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
//获取订单列表详情
export const getShopDetail = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
//获取默认地址
export const getMoRenAddress = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
//获取购车列表
export const getCartList = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}

// 加入购物车
export const joinShopCart = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 获取收藏列表
export const collectionList = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
// 删除购物车列表
export const deleteCartProduct = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 记录购物车数量
export const chageQuantity = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
//删除地址
export const deleteAddress = (data) => {
	return http.post('api/MembersAPI.ashx', data)
}
//提交订单
export const Submmitorder = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 评价接口
export const evaluate = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
//退货
export const RequestReturn = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
//确认收货
export const FinishOrder = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 获取一级分类接口
export const fristClassification = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
// 根据一级分类数据的id 获取二三级分类接口
export const remainingClassification = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
// 查看物流信息
export const Logistic = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 添加银行卡、微信、支付宝
export const addTo = (data) => {
	return http.post('api/MembersApi.ashx', data)
}
// 查询银行卡、微信、支付宝
export const query = (data) => {
	return http.post('api/MembersApi.ashx', data)
}
export const aliPay = (data) => {
	return http.post('api/alipay.ashx', data)
}
// 修改银行卡、微信、支付宝
export const modifyQuery = (data) => {
	return http.post('api/MembersApi.ashx', data)
}
//SubmitRecharge
export const SubmitRecharge = (data) => {
	return http.post('api/MembersApi.ashx', data)
}
// 查看商品的评价
export const seeShopEvaluate = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
export const payWay = (data) => {
	return http.post('api/WeiXinPay.ashx', data)
}
// 增加浏览量的接口
export const browse = (data) => {
	return http.post('api/ProductsAPI.ashx', data)
}
// 查询数字资产接口
export const assets = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 鱼币
export const getFish = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 查看交易明细接口
export const transactionDetails = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取获取统计分析的数据
export const total = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取团队人数数据
export const team = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取团队业绩数据
export const teamPerformance = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取余额的消费情况的数据
export const consumptionBalance = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取现金的消费情况的数据
export const consumptionCash = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取鱼币的消费情况的数据
export const consumptionFc = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 查看鱼币的发放记录
export const fcDistributionRecord = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 获取我的粉丝数据
export const fans = (data) => {
	return http.post('api/OrdersApi.ashx', data)
}
// 设置鱼币开盘价格
export const setUpFc = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 获取鱼币的折线图
export const FcLineVhart = (data) => {
	return http.post('api/OrdersAPI.ashx', data)
}
// 提现
export const getMoney = (data) => {
	return http.post('api/VshopProcess.ashx', data)
}
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	login,
	productDetail,
	saveUserAddr,
	userAddrSelectByUserId,
	userAddrDeleteById,
	orderList,
	createOrder,
	saveUserIdentity,
	saveUserPaymentCode,
	userPaymentCode,
	orderDetail,
	productMyList,
	uploadPaymentProof,
	selectByTokenUserIdentity,
	swiper,
	logout,
	frist,
	productList,
	shopDetails,
	collection,
	cancelCollection,
	homeCategoriesList,
	sKUAttributes,
	forgetPassword,
	submitAddress,
	getAddresList,
	orderList,
	getShopDetail,
	getMoRenAddress,
	getCartList,
	joinShopCart,
	isCollect,
	collectionList,
	deleteCartProduct,
	chageQuantity,
	deleteAddress,
	Submmitorder,
	evaluate,
	cancelOrder,
	RequestReturn,
	FinishOrder,
	fristClassification,
	remainingClassification,
	Logistic,
	getUserInfo,
	addTo,
	query,
	modifyQuery,
	SubmitRecharge,
	seeShopEvaluate,
	payWay,
	browse,
	assets,
	getFish,
	transactionDetails,
	total,
	team,
	teamPerformance,
	consumptionBalance,
	consumptionCash,
	consumptionFc,
	fcDistributionRecord,
	fans,
	setUpFc,
	FcLineVhart,
	aliPay,
	getMoney
}