<template>
  <view>
    <!-- 第一个列表 -->
    <view class="list-box">
      <view>
        <image src="/static/vip/list4.png"
               mode=""></image>
        <text class="vip-list-name">发行总量</text>
        <text class="num">{{isSueObj.Issue | numFilter}}</text>
      </view>
      <view>
        <image src="/static/vip/list1.png"
               mode=""></image>
        <text class="vip-list-name">剩余总数</text>
        <text class="num">{{isSueObj.Surplus | numFilter}}</text>
      </view>
      <view>
        <image src="/static/vip/list2.png"
               mode=""></image>
        <text class="vip-list-name">流通总数</text>
        <text class="num">{{isSueObj.Circulate | numFilter}}</text>
      </view>
    </view>
    <!-- 第二个列表 -->
    <view>
      <view class="list-second">
        <view>
          <view class="image-box">
            <image src="/static/vip/jiageprice1.png"
                   mode=""
                   class="image"></image><text>今日价</text>
          </view>
          <view class="price">{{ price.todayPrice | numFilter }}</view>
        </view>
        <view>
          <view class="image-box">
            <image src="/static/vip/jiageprice2.png"
                   mode=""
                   class="image"></image><text>昨日价</text>
          </view>
          <view class="price">{{ price.yesterdayPrice | numFilter }}</view>
        </view>
        <view>
          <view class="one">历史价</view>
          <image src="/static/vip/tubiaozhexiantu.png"
                 mode=""
                 class="image2"></image>
        </view>
      </view>
    </view>
    <!-- 第三个列表 -->
    <view>
      <view class="list-second"
            style="border-top: none;">
        <view>
          <view class="image-box">
            <image src="/static/vip/xiangmuguanlifuzhi.png"
                   mode=""
                   class="image"></image><text>今日量</text>
          </view>
          <view class="price">{{ number.todayNumber | numFilter }}</view>
        </view>
        <view>
          <view class="image-box">
            <image src="/static/vip/xiangmuguanlifuzhi1.png"
                   mode=""
                   class="image"></image><text>昨日量</text>
          </view>
          <view class="price">{{ number.yesterdayNumber | numFilter }}</view>
        </view>
        <view>
          <view class="one">历史量</view>
          <image src="/static/vip/list3.png"
                 mode=""
                 class="image2"></image>
        </view>
      </view>
    </view>
    <view class="tips">鱼币的开盘价格设置时间段为: 早上9:00 至 早上9:30</view>
    <view class="footer">
      <view class="footer-box">
        <view class="today">今日开盘价</view>
        <view>
          <input type="number"
                 placeholder="请输入今日开盘价"
                 v-model="ModifiedBalance" />
        </view>
      </view>
      <view class="determine"
            @click="determines">确定</view>
    </view>
    <view class="qiun-columns">
      <view>
        <view class="line">鱼币折线图</view>
      </view>
      <view class="qiun-charts">
        <!--#ifdef MP-ALIPAY -->
        <canvas canvas-id="canvasLineA"
                id="canvasLineA"
                class="charts"
                :width="cWidth*pixelRatio"
                :height="cHeight*pixelRatio"
                :style="{'width':cWidth+'px','height':cHeight+'px'}"
                @touchstart="touchLineA"
                @touchmove="moveLineA"
                @touchend="touchEndLineA"></canvas>
        <!--#endif-->
        <!--#ifndef MP-ALIPAY -->
        <canvas canvas-id="canvasLineA"
                id="canvasLineA"
                class="charts"
                @touchstart="touchLineA"
                @touchmove="moveLineA"
                @touchend="touchEndLineA"></canvas>
        <!--#endif-->
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from '@/js_sdk/u-charts/u-charts/u-charts';
var _self;
var canvaLineA = null;
var lastMoveTime = null;//最后执行移动的时间戳
export default {
  data() {
    return {
      // 发行总量
      isSueObj: {},
      // 今日价格
      price: {},
      // 今日量
      number: {},
      // 输入框绑定的值
      ModifiedBalance: '',
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      textarea: '',
      Interactive: '',//交互显示的数据,
      categories: [],
      series: []
    };
  },
  onLoad() {
    // 获取统计分析的数据
    this.getTotal();
    _self = this;
    //#ifdef MP-ALIPAY
    uni.getSystemInfo({
      success: function (res) {
        if (res.pixelRatio > 1) {
          //正常这里给2就行，如果pixelRatio=3性能会降低一点
          //_self.pixelRatio =res.pixelRatio;
          this.pixelRatio = 2;
        }
      }
    });
    //#endif
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    this.getServerData();
  },
  methods: {
    async getServerData() {
      this.categories = [],
        this.series = []
      let data = {
        action: 'ReadFishMoneyDay'
      }
      let res = await this.$api.api.FcLineVhart(data)
      if (res.data.status == true) {
        var arr = res.data.aa.saregorise
        for (var i = 0; i < arr.length; i++) {
          this.categories.push((arr[i].split(' ')[0]).slice(5))
        }
        let LineA = { categories: [], series: [] };
        this.series = res.data.aa.series
        // LineA.categories = res.data.aa.saregorise
        LineA.categories = this.categories
        LineA.series = this.series
        //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
        this.showLineA("canvasLineA", LineA);
      }
    },
    showLineA(canvasId, chartData) {
      canvaLineA = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'line',
        fontSize: 12,
        legend: true,
        dataLabel: true,
        dataPointShape: true,
        background: '#FFFFFF',
        colors: ['#ff0000'],
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        xAxis: {
          type: 'grid',
          gridColor: '#CCCCCC',
          gridType: 'dash',
          dashLength: 8,
          //disableGrid:true
        },
        yAxis: {
          gridType: 'dash',
          gridColor: '#CCCCCC',
          dashLength: 8,
        },
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          line: {
            type: 'straight'
          }
        }
      });

    },
    touchLineA(e) {
      lastMoveTime = Date.now();
    },
    moveLineA(e) {
      let currMoveTime = Date.now();
      let duration = currMoveTime - lastMoveTime;
      if (duration < Math.floor(1000 / 60)) return;//每秒60帧
      lastMoveTime = currMoveTime;

      let currIndex = canvaLineA.getCurrentDataIndex(e);
      if (currIndex > -1 && currIndex < canvaLineA.opts.categories.length) {
        let riqi = canvaLineA.opts.categories[currIndex];
        let leibie = canvaLineA.opts.series[0].name;
        let shuju = canvaLineA.opts.series[0].data[currIndex];
        this.Interactive = leibie + ':' + riqi + '-' + shuju + '元';
      }
      canvaLineA.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      });
    },
    touchEndLineA(e) {
      let currIndex = canvaLineA.getCurrentDataIndex(e);
      if (currIndex > -1 && currIndex < canvaLineA.opts.categories.length) {
        let riqi = canvaLineA.opts.categories[currIndex];
        let leibie = canvaLineA.opts.series[0].name;
        let shuju = canvaLineA.opts.series[0].data[currIndex];
        this.Interactive = leibie + ':' + riqi + '-' + shuju + '元';
      }
      canvaLineA.touchLegend(e);
      canvaLineA.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      });
    },
    changeData() {
      if (isJSON(this.textarea)) {
        let newdata = JSON.parse(this.textarea);
        canvaLineA.updateData({
          series: newdata.series,
          categories: newdata.categories
        });
      } else {
        uni.showToast({
          title: '数据格式错误',
          image: '../../../static/images/alert-warning.png'
        })
      }
    },
    // 获取统计分析的数据
    async getTotal() {
      let data = {
        action: 'FishStatistics',
      };
      let res = await this.$api.api.total(data);
      if (res.data.status == true) {
        // console.log(res)
        this.isSueObj = res.data.issue;
        this.price = res.data.price;
        this.number = res.data.number;
      }
    },
    determines() {
      uni.showModal({
        content: '确定设置今日开盘价格',
        success: (res) => {
          if (res.confirm) {
            this.determine()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 设置开盘价格
    async determine() {
      if (this.ModifiedBalance == '') {
        return this.$api.msg('请输入开盘价格')
      }
      this.ModifiedBalance = Math.floor(this.ModifiedBalance * 100) / 100
      let result = {}
      result = {
        ModifiedBalance: this.ModifiedBalance
      }
      result = JSON.stringify(result)
      let data = {
        action: 'CreateFishMoney',
        data: result
      }
      let res = await this.$api.api.setUpFc(data)
      if (res.data.status == 0) {
        this.$api.msg('设置成功')
        this.getServerData()
        this.ModifiedBalance = ''
      } else if (res.data.status == 2) {
        this.$api.msg('您今日已设置开盘价格')
        this.ModifiedBalance = ''
      } else if (res.data.status == 1) {
        this.$api.msg('不在设置时间内,无法设置鱼币开盘价格')
      }
    }
  },
  filters: {
    numFilter(value) {
      let realVal = ''
      if (!isNaN(value) && value !== '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2)
      } else {
        realVal = '--'
      }
      return realVal
    }
  }
}
</script>
<style>
.qiun-charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}

.charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}
</style>
<style lang="scss">
.list-box {
  display: flex;
  margin-top: 20rpx;
  padding: 30rpx 0;

  > view {
    flex: 1;
    text-align: center;

    image {
      width: 70rpx;
      height: 70rpx;
    }

    text {
      display: block;
      text-align: center;
    }

    .vip-list-name {
      color: #7b7b7b;
      font-size: 26rpx;
    }

    .num {
      font-size: 22rpx;
      color: #000;
      font-weight: bold;
    }
  }
}

.list-second {
  display: flex;
  border-top: 10rpx solid #f5f5f5;
  border-bottom: 10rpx solid #f5f5f5;
  padding: 30rpx 0;

  > view {
    flex: 1;
    text-align: center;

    .price {
      font-size: 26rpx;
      font-weight: bold;
      margin-top: 18rpx;
    }

    .image-box {
      display: flex;
      align-items: center;
      justify-content: center;

      > text {
        margin-left: 20rpx;
        font-size: 28rpx;
        color: #7b7b7b;
      }
    }

    .image {
      height: 40rpx;
      width: 50rpx;
    }

    .image2 {
      width: 37rpx;
      height: 32rpx;
      margin-top: 16px;
    }

    .one {
      font-size: 28rpx;
      color: #7b7b7b;
    }
  }
}
.tips {
  text-align: center;
  margin: 10rpx 0;
}
.footer {
  padding: 0 20rpx;
  margin-top: 20rpx;
  width: 100%;
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .footer-box {
    display: flex;
    align-items: center;
    .today {
      margin-right: 20rpx;
    }
    input {
      height: 70rpx;
      padding-left: 20rpx;
      border-radius: 20rpx;
      border: 1rpx solid #f56c6c;
    }
  }
  .determine {
    font-size: 28rpx;
    padding: 5rpx 20rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #f56c6c;
    color: #fff;
  }
}
.qiun-columns {
  margin-top: 20rpx;
  .line {
    margin: 20rpx 0 20rpx 20rpx;
    border-left: 10rpx solid red;
    padding-left: 20rpx;
  }
}
</style>
