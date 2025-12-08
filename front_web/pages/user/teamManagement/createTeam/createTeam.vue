<template>
  <view>
    <!-- 头部区域 -->
    <view class="tab-box">
      <view class="tab-list">
        <view class="tab-item"
              v-for="(item, index) in tabList"
              :key="index"
              :class="item.id == current ? 'tabActive' : ''"
              @click="tabChange(item.id)">{{item.name}}</view>
      </view>
    </view>
    <view class="tab-box-copy"></view>
    <!-- 筛选 -->
    <view class="screen">
      <view class="screen-left">
        <text>共有<text class="left-num">{{tabList[this.current].page.total}}</text>人</text>
        <text>有效<text class="left-num">{{validcounts}}</text>人</text>
      </view>
      <view class="screen-right"
            @click="openScreen">
        <view>筛选</view>
        <image src="/static/screen.png"></image>
      </view>
    </view>
    <!-- 列表区域 -->
    <view class="list">
      <view class="list-item"
            v-for="(item, index) in tabList[this.current].list"
            :key="index">
        <view class="item-top">
          <view class="item-info">
            <image :src="item.UserHead"></image>
            <view class="name-phone">
              <view>{{item.UserName}}</view>
              <view class="name">{{item.GradeId}}</view>
            </view>
          </view>
          <view></view>
          <view @click="openDetails(item)">详情</view>
        </view>
        <view class="item-middle">
          <view class="middle-common">
            <view>今日直邀(<text>人</text>)</view>
            <view>今日消费(<text>v</text>)</view>
            <view>本月直邀(<text>人</text>)</view>
            <view>本月消费(<text>v</text>)</view>
          </view>
          <view class="middle-common number">
            <view>{{item.TDReferralUserCount}}</view>
            <view>{{item.TDConsumptionAmount | numFilter}}</view>
            <view>{{item.ReferralUserCount}}</view>
            <view>{{item.TMConsumptionAmount | numFilter}}</view>
          </view>
        </view>
        <view class="item-bottom">
          <view class="bottom-content">
            <view class="leader">团长进度</view>
            <view class="progress">
              <view class="speed-progress"></view>
            </view>
            <view class="right"
                  @click="goDetails(item.UserId)">
              <view>邀请明细</view>
              <image src="/static/vip/right.png"></image>
            </view>
          </view>
          <view class="bottom-time">2020-05-13 15:40</view>
        </view>
      </view>
    </view>
    <!-- 我的导师 -->
    <view class="tutor-copy"></view>
    <view class="tutor">
      我的导师:<text style="margin-left: 10rpx;">{{myTeacher}}</text>
    </view>
    <!-- 筛选弹出框 -->
    <uni-popup ref="popup"
               type="center">
      <view class="screen-popup">
        <view class="screen-popup-top">
          <view v-for="(item, index) in screenList"
                :key="index"
                :class="item.sId == screenCurrent ? 'screenActive' : ''"
                @click="screenChange(item.sId)">{{item.text}}</view>
        </view>
      </view>
    </uni-popup>
    <!-- 详情弹出框 -->
    <uni-popup ref="popups"
               type="center">
      <view class="details-popup">
        <view class="details-title">ID: {{oldList.UserBindName}}</view>
        <view class="details-content">
          <view class="details-common">
            <view class="details-previous">上月收益<text>(¥)</text></view>
            <view class="details-price">1233.09</view>
          </view>
          <view class="details-common">
            <view class="details-previous">上月有效粉丝<text>(人)</text></view>
            <view class="details-price">2134</view>
          </view>
        </view>
        <view class="footer">
          <view class="footer-common">
            <view>团长进度</view>
            <view>0/0</view>
          </view>
          <view class="footer-common">
            <view>直邀人数</view>
            <view>{{oldList.ReferralUserCount}}</view>
          </view>
          <view class="footer-common">
            <view>最近下单时间</view>
            <view>{{overDan}}</view>
          </view>
          <view class="footer-common">
            <view>注册时间</view>
            <view>{{oldList.CreateDate}}</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
export default {
  components: {
    uniPopup
  },
  computed: {
    overDan() {
      if (this.oldList.LastOrderDate) {
        return this.oldList.LastOrderDate
      } else {
        return "无"
      }
    }
  },
  data() {
    return {
      // 分页
      page: {
        // 当前页码
        pageIndex: 1,
        // 每页显示的条数
        pageSize: 10,
      },
      // 节流阀
      flag: true,
      // 总的数据条数
      total: '',
      // 数据列表
      list: [],
      // tab 栏数据
      tabList: [{
        name: '直邀',
        id: 0,
        list: [],
        type: 1,
        page: {
          // 当前页码
          pageIndex: 0,
          // 每页显示的条数
          pageSize: 10,
          total: null
        }
      },
      {
        name: '其他',
        id: 1,
        list: [],
        type: 2,
        page: {
          // 当前页码
          pageIndex: 0,
          // 每页显示的条数
          pageSize: 10,
          total: null
        }
      },
      {
        name: '团长',
        id: 2,
        list: [],
        type: 2,
        page: {
          // 当前页码
          pageIndex: 0,
          // 每页显示的条数
          pageSize: 10,
          total: null
        }
      }],
      // tab 栏默认选中项
      current: 0,
      // 弹出框数据
      screenList: [
        {
          sId: 1,
          text: '全部',
          id: -1
        },
        {
          sId: 2,
          text: '有效',
          id: 1
        },
        {
          sId: 3,
          text: '无效',
          id: 0
        }
      ],
      // 弹出框默认选中项
      screenCurrent: 1,
      validcounts: '',
      myTeacher: uni.getStorageSync('userInfo').RUserBindName,
      IsConsumption: -1,
      oldList: ''
    }
  },
  onLoad() {
    // 获取我的粉丝数据
    this.getFans()
  },
  // 监听页面滚动到底部
  onReachBottom() {
    if (this.tabList[this.current].page.pageIndex >= this.tabList[this.current].page.total) {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    } else {
      // 获取我的粉丝数据
      this.getFans()
    }
  },
  methods: {
    // 获取我的粉丝数据
    async getFans() {
      let start = this.tabList[this.current].page.pageIndex
      let GradeId = ""
      let rank = ""
      if (this.current == 2) {
        GradeId = this.tabList[this.current].type
        rank = ""
      } else {
        rank = this.tabList[this.current].type
        GradeId = ""
      }
      let data = {
        Offset: Math.ceil(start / 10),
        RowNumber: 10,
        rank: rank,
        GradeId: GradeId,
        IsConsumption: this.IsConsumption
      }
      let StringData = JSON.stringify(data)
      let params = {
        action: 'GetDirectReferralsByPage',
        data: StringData
      }
      let res = await this.$api.api.login(params)
      if (res.data.status == true) {
        res.data.data.forEach((item, index) => {
          if (item.GradeId == 1) {
            item.GradeId = '普通会员';
          }
          else if (item.GradeId == 2) {
            item.GradeId = ' 推广员1级';
          }
          else if (item.GradeId == 3) {
            item.GradeId = ' 推广员2级';
          }
          else if (item.GradeId == 4) {
            item.GradeId = ' 推广员3级';
          }
          else if (item.GradeId == 5) {
            item.GradeId = ' 推广员4级';
          }
          else if (item.GradeId == 6) {
            item.GradeId = ' 推广员5级';
          }
          if (!item.UserHead) {
            item.UserHead = "/static/missing-face.png"
          }
        })
        //有效人数
        this.validcounts = res.data.validcounts
        this.tabList[this.current].list = this.tabList[this.current].list.concat(res.data.data)
        this.tabList[this.current].page.pageIndex += res.data.data.length
        this.tabList[this.current].page.total = res.data.counts
      }
    },
    // 点击切换 tab 栏
    tabChange(id) {
      this.current = id
      this.tabList[this.current].page.pageIndex = 0
      this.tabList[this.current].list = []
      this.getFans()
    },
    // 点击打开筛选的弹框
    openScreen() {
      this.$refs.popup.open()
    },
    // 筛选弹出框的选中项改变的时候
    screenChange(id) {
      this.screenCurrent = id
      let num = id - 1
      this.IsConsumption = this.screenList[num].id
      this.tabList[this.current].page.pageIndex = 0
      this.tabList[this.current].list = []
      this.getFans()
      this.$refs.popup.close()
    },
    // 打开详情的弹出框
    openDetails(item) {
      this.oldList = item
      this.$refs.popups.open()
    },
    // 去邀请明细页面
    goDetails(id) {
      uni.navigateTo({
        url: '/pages/user/teamManagement/createTeam/invitationDetails?id=' + id
      })
    }
  }
}
</script>

<style lang="scss">
.tab-box {
  position: fixed;
  width: 100%;
  top: 88rpx;
  height: 68rpx;
  background-color: #fff;
  z-index: 1;
  // 头部区域
  .tab-list {
    display: flex;
    justify-content: space-evenly;
    .tab-item {
      font-size: 36rpx;
      color: #8e8e8e;
      border-bottom: 4rpx solid transparent;
    }
    // tab 栏选中状态
    .tabActive {
      color: #323f6c;
      border-bottom: 4rpx solid #323f6c;
    }
  }
}
.tab-box-copy {
  height: 68rpx;
  width: 100%;
}
// 筛选区域
.screen {
  display: flex;
  justify-content: space-between;
  margin: 24rpx 0;
  padding: 0 36rpx;
  .screen-left {
    .left-num {
      color: #c62e36;
      margin: 0 10rpx;
    }
  }
  .screen-right {
    display: flex;
    align-items: center;
    > image {
      margin-left: 6rpx;
      width: 24rpx;
      height: 24rpx;
    }
  }
}
// 列表区域
.list {
  padding: 0 26rpx;
  .list-item {
    padding: 32rpx 18rpx 20rpx;
    border-radius: 40rpx;
    background-color: #fff;
    box-shadow: 0rpx 0rpx 28rpx 0rpx rgba(213, 213, 213, 0.5);
    margin-bottom: 20rpx;
    .item-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .item-info {
        display: flex;
        .name-phone {
          margin-left: 26rpx;
          .name {
            color: #6271a8;
          }
        }
        > image {
          width: 80rpx;
          height: 80rpx;
        }
      }
    }
    .item-middle {
      margin: 10rpx 0;
      .middle-common {
        display: flex;
        justify-content: space-evenly;
        > view {
          flex: 1;
          text-align: center;
          font-size: 22rpx;
          > text {
            font-size: 17rpx;
            color: #797979;
          }
        }
      }
      .number {
        margin: 10rpx 0;
        font-weight: 600;
        color: #333333;
      }
    }
    .item-bottom {
      .bottom-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .leader {
          font-size: 22rpx;
          color: #555555;
        }
        .progress {
          width: 400rpx;
          height: 8rpx;
          background-color: #ddd;
          border-radius: 4rpx;
          .speed-progress {
            width: 60%;
            height: 100%;
            border-radius: 4rpx;
            background-color: #6271a8;
          }
        }
        .right {
          display: flex;
          align-items: center;
          > view {
            font-size: 22rpx;
            color: #9b9b9b;
          }
          > image {
            width: 34rpx;
            height: 34rpx;
          }
        }
      }
      .bottom-time {
        font-size: 20rpx;
        color: #9e9e9e;
      }
    }
  }
}
// 我的导师
.tutor-copy {
  height: 94rpx;
  width: 100%;
  color: #555;
}
.tutor {
  background-color: #fff;
  border-top: 10rpx solid #f5f5f5;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 94rpx;
  line-height: 94rpx;
  text-align: center;
}
// 筛选弹出框
.screen-popup {
  padding: 30rpx;
  border-radius: 15rpx;
  background-color: #fff;
  .screen-popup-top {
    display: flex;
    > view {
      font-size: 30rpx;
      margin: 0 10rpx;
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      border-radius: 10rpx;
      color: #323f6c;
      font-weight: 600;
    }
    .screenActive {
      color: #ce5757;
    }
  }
}
// 详情的弹出框
.details-popup {
  width: 616rpx;
  border-radius: 14rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .details-title {
    width: 100%;
    height: 107rpx;
    line-height: 107rpx;
    color: #fff;
    background-color: #323f6c;
    font-size: 32rpx;
    text-align: center;
    border-radius: 14rpx 14rpx 0 0;
  }
  .details-content {
    width: 550rpx;
    height: 124rpx;
    display: flex;
    margin: 20rpx 0;
    justify-content: space-between;
    background-color: #f5f5f5;
    .details-common {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      .details-previous {
        font-size: 26rpx;
        color: #323f6c;
        > text {
          font-size: 22rpx;
          color: #b8b8b8;
        }
      }
      .details-price {
        font-size: 26rpx;
        color: #d75353;
      }
    }
  }
  .footer {
    padding: 0 34rpx;
    width: 100%;
    .footer-common {
      padding: 10rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > view {
        font-size: 26rpx;
        font-weight: 600;
        color: #323f6c;
      }
    }
  }
}
</style>
