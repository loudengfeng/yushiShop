import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		saveAddress:{		
			mobile: '',
			receiver: '',
			province: '',
			city: '',
			area: '',
			addrDetail: '',
			},
		getshop:[],
		saveRefund:'',
		getPhone:''
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
		},
		getPhone(state, provider){
			uni.setStorage({//缓存用户登陆状态
			    key: 'phone',  
			    data: provider  
			}) 
		},
		logout(state) {
			state.hasLogin = false;
			uni.removeStorage({  
                key: 'token'  
            })
			uni.removeStorage({
			    key: 'phone'  
			})
		},
		saveAddress(state,provider){
			state.saveAddress = provider

		},
		shopList(state,provider){
			state.getshop = provider
		},
		saveRefund(state,provider){
			state.saveRefund = provider
		}
	},
	actions: {
	
	}
})

export default store
