<template>
  <view class="content">
    <view class="row b-b">
      <text class="tit">联系人</text>
      <input class="input"
             type="text"
             v-model="addressData.receiver"
             placeholder="收货人姓名"
             placeholder-class="placeholder" />
    </view>
    <view class="row b-b">
      <text class="tit">手机号</text>
      <input class="input"
             type="number"
             v-model="addressData.mobile"
             placeholder="收货人手机号码"
             placeholder-class="placeholder" />
    </view>
    <view class="row b-b provincial-city"
          @tap="showPicker('region')">
      <view class="city">省市区</view>
      <view class="placeholder">{{addressData.showResult}}</view>
      <w-picker mode="region"
                default-type="value"
                :hide-area="false"
                @confirm="onConfirm($event,'region')"
                @cancel="onCancel"
                ref="region"></w-picker>
    </view>
    <!-- <view class="row b-b">
      <text class="tit">地址</text>
      <text @click="chooseLocation" class="input">
        {{ addressData.addressName }}
      </text>
      <text class="yticon icon-shouhuodizhi"></text>
    </view> -->
    <view class="row b-b">
      <input class="input"
             type="text"
             v-model="addressData.addrDetail"
             placeholder="详细地址"
             placeholder-class="placeholder" />
    </view>
    <!-- <view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view> -->

    <view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.commonAddr" color="#fa436a" @change="switchChange" />
		</view>
    <button class="add-btn"
            @click="confirm">提交</button>
  </view>
</template>

<script>
import wPicker from "@/components/w-picker/w-picker.vue"
export default {
  components: {
    wPicker
  },
  data () {
    return {
      type: '',
      // 详细地址
      detailAddress: '',
      // 修改地址的 id
      ShippingId: '',
      addressData: {
		  id: '',
        // 收货人姓名
        receiver: '',
        // 收货人手机号码
        mobile: '',
        addressName: '在地图选择',
        addrDetail: '',
        area: '',
        default: false,
        // 省市区选择的地区
        result: '',
        // 显示在页面上的省市区
        showResult: '请选择省市区',
        // 省的坐标
        provinceId: '',
        // 市的坐标
        cityId: '',
        // 区的坐标
        regionId: '',
		commonAddr: true,
		  "provinceCode": "",
		  "province": "",
		  "city": "",
		  "cityCode": "",
		  "area": "",
		  "areaCode": "",
      },
    };
  },
  onLoad (option) {
    let title = '新增收货地址';
    this.type = option.type;
    if (option.type === 'edit') {
      title = '编辑收货地址';
	  this.addressData.id = JSON.parse(option.data).id
      this.addressData.receiver = JSON.parse(option.data).receiver;
      this.addressData.mobile = JSON.parse(option.data).mobile;
      this.addressData.commonAddr = JSON.parse(option.data).commonAddr;
      this.addressData.result = JSON.parse(option.data).province + ',' + JSON.parse(option.data).city + ',' + JSON.parse(option.data).area
      this.addressData.showResult = JSON.parse(option.data).province + JSON.parse(option.data).city + JSON.parse(option.data).area
      this.addressData.addrDetail = JSON.parse(option.data).addrDetail
      this.detailAddress = JSON.parse(option.data).Address
      this.addressData.provinceId = JSON.parse(option.data).provinceCode
      this.addressData.cityId = JSON.parse(option.data).cityCode
      this.addressData.regionId = JSON.parse(option.data).areaCode
	  this.addressData.provinceCode = JSON.parse(option.data).provinceCode
	  this.addressData.cityCode = JSON.parse(option.data).cityCode
	  this.addressData.areaCode = JSON.parse(option.data).areaCode
    }
    this.manageType = option.type;
    uni.setNavigationBarTitle({
      title,
    });
  },
  methods: {
    showPicker (type) {
      this.$refs[type].show();
    },
    onConfirm (res, type) {
      console.log(res)
      this.addressData.provinceId = res.value[0]
      this.addressData.cityId = res.value[1]
      this.addressData.regionId = res.value[2]
      this.addressData.result = res.obj.province.label + ',' + res.obj.city.label + ',' + res.obj.area.label
      this.addressData.showResult = res.result
    },
    onCancel () {
      console.log('取消')
    },
    switchChange(e){
    	this.addressData.commonAddr = e.detail.value;
		console.log(e.detail)
    },

    //地图选择地址
    // chooseLocation() {
    //   uni.chooseLocation({
    //     success: (data) => {
    //       console.log(data);
    //       this.addressData.addressName = data.address;
    //       this.addressData.address = data.address;
    //     },
    //   });
    // },

    //提交
    confirm () {
      uni.showLoading({
        title: '加载中',
        mask: true
      });
      let data = JSON.parse(JSON.stringify(this.addressData));
	  data.result = data.result.split(',')
	  data.provinceCode = data.provinceId
	  data.province =data.result[0]
	  data.city = data.result[1]
	  data.cityCode = data.cityId
	  data.area =data.result[2]
	  data.areaCode = data.regionId
	  data.commonAddr = data.commonAddr ? '1' : '0'
      if (!data.receiver) {
        this.$api.msg('请填写收货人姓名');
        return;
      }
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
        this.$api.msg('请输入正确的手机号码');
        return;
      }
      if (!data.area) {
        this.$api.msg('请选择省市区');
        return;
      }
      if (!data.addrDetail) {
        this.$api.msg('请输入详细地址');
        return;
      }
      let actions = '';
      if (this.type == 'edit') {
        actions = 'UpdateShippingAddress';
      } else {
        actions = 'AddShippingAddress';
      }
      // console.log(actions);
      //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
      // this.$api.prePage().refreshList(data, this.manageType);
      // let allAddress = this.addressData.result + this.detailAddress;
      if (this.ShippingId == undefined) {
        this.ShippingId = 0
      }
      this.$api.api.saveUserAddr(data).then((res) => {
        if (res.code == '000000') {
          uni.hideLoading();
          let pp = this.manageType == 'edit' ? '修改' : '添加'
          let source = ''
          if (pp == '修改' || pp == '添加') {
            source = 2
          }
          this.$api.msg(`地址${this.manageType == 'edit' ? '修改' : '添加'}成功`, 800, true, 'none');
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/address/address?source=' + source
            });
          }, 800);
        } else {
          this.$api.msg(`地址${this.manageType == 'edit' ? '修改' : '添加'}失败`);
        }
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-top: 16upx;
}
.provincial-city {
  display: flex;
  .city {
    width: 17%;
  }
}
.row {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30upx;
  height: 110upx;
  background: #fff;

  .tit {
    flex-shrink: 0;
    width: 120upx;
    font-size: 30upx;
    color: $font-color-dark;
  }
  .input {
    flex: 1;
    font-size: 30upx;
    color: $font-color-dark;
  }
  .icon-shouhuodizhi {
    font-size: 36upx;
    color: $font-color-light;
  }
}
.default-row {
  margin-top: 16upx;
  .tit {
    flex: 1;
  }
  switch {
    transform: translateX(16upx) scale(0.9);
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
