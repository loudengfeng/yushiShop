<template>
  <div class="order-management">
<!--    <h2>订单管理</h2>-->
    <div class="search-section">
      <el-input
        v-model.trim="searchContent"
        placeholder="请输入订单号"
        style="width: 300px;"
        clearable
      />
      <el-button type="primary" @click="searchOrders">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>
    <!-- 搜索和筛选区域 -->

    <!-- 订单统计卡片 -->

    <!-- 订单列表 -->
    <div class="order-list" style="margin-top: 20px;">
      <el-table
          :data="orderList"
          v-loading="loading"
          border
          stripe
      >
        <el-table-column prop="id" label="订单号"></el-table-column>
        <el-table-column prop="userMobile" label="用户"></el-table-column>
        <el-table-column prop="actualPrice" label="单价">
          <template #default="{row}">
            ¥{{ row.actualPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="{row}">
            <el-tag :type="getStatusType(row.orderStatus)">
              {{ getStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="{row}">
            <el-button type="success" size="small" @click="handleCom(row)" v-if="row.orderStatus == 10 || row.orderStatus == 0">完结订单</el-button>
            <el-button type="primary" size="small" @click="updatePrice(row)" v-if="row.orderStatus == 0">修改支付价格</el-button>
            <el-button size="small" @click="viewOrder(row)">查看</el-button>
            <el-button
                size="small"
                type="primary"
                v-if="row.status === 'pending'"
                @click="updateStatus(row, 'paid')"
            >
              确认付款
            </el-button>
            <el-button
                size="small"
                type="success"
                v-if="row.status === 'paid'"
                @click="updateStatus(row, 'shipped')"
            >
              发货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
      </el-pagination>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="60%">
      <div v-if="currentOrder" class="order-detail">
        <el-row>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">订单号：</span>
              <span>{{ currentOrder.id }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">下单时间：</span>
              <span>{{ currentOrder.createTime }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">用户：</span>
              <span>{{ currentOrder.userMobile }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">订单状态：</span>
              <el-tag :type="getStatusType(currentOrder.orderStatus)">
                {{ getStatusText(currentOrder.orderStatus) }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">订单金额：</span>
              <span class="amount">¥{{ currentOrder.actualPrice }}</span>
            </div>
          </el-col>
          <el-col :span="12" v-if="currentOrder.subPrice">
            <div class="detail-item">
              <span class="label">实付金额：</span>
              <span class="amount">¥{{ currentOrder.subPrice }}</span>
            </div>
          </el-col>
        </el-row>
        <div class="product-list">
          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">收件人：</span>
                <span>{{ currentOrder.addrSnapshot.receiver }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">收件人联系方式：</span>
                <span>{{ currentOrder.addrSnapshot.mobile }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="detail-item">
                <span class="label">收件人地址：</span>
                <span>{{ currentOrder.addrSnapshot.province }}{{ currentOrder.addrSnapshot.city }}{{ currentOrder.addrSnapshot.area }}{{currentOrder.addrSnapshot.addrDetail}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="product-list">
          <h4>商品列表</h4>
          <el-table :data="productsData" border>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template #default="{row}">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" width="400">
              <template #default="{row}">
                <img style="width: 280px;height: 280px" :src="row.imgUrl" alt="">
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改支付价格" :visible.sync="dialogVisibleA" width="400px">
      <el-form :model="upDateForm" :rules="rules" ref="userForm">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="upDateForm.subPrice" :precision="2" :step="1"></el-input-number>
          </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submitUpdatePrice">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {orderDetail, orderList, setSubPrice} from '@/api/shop'
import { makeOrderComplete } from '../api/shop'

export default {
  name: "order",
  data() {
    return {
      upDateForm: {
        subPrice: ''
      },
      rules: {
        subPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
      },
      dialogVisibleA: false,
      searchContent: '',
      searchForm: {
        orderNo: '',
        status: '',
        dateRange: []
      },
      stats: {
        total: 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0
      },
      loading: false,
      orderList: [],
      page:{
        page: 1,
        pageSize: 10,
        total: null
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      currentOrder: null,
      productsData:[]
    }
  },
  mounted() {
    this.fetchOrders();
    // this.fetchStats();
  },
  methods: {
    submitUpdatePrice(){
      this.$refs.userForm.validate(valid => {
        if(valid){
          if(!this.upDateForm.subPrice){
            return this.$message.error('请输入价格')
          }
          setSubPrice({...this.upDateForm,id: this.orderId}).then(res => {
            this.fetchOrders()
            this.dialogVisibleA = false
          })
        }
      })
    },
    updatePrice(row){
      this.orderId = row.id
      this.dialogVisibleA = true
    },
    handleCom(row) {
      this.$confirm('确定要完成商品的交易吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          // 这里应该调用实际的API接口
          // await this.$api.deleteUser(row.id);
          makeOrderComplete({ id: row.id }).then(res => {
            this.$message.success('操作成功');
            this.getData();
          })
        } catch (error) {
          console.error(error);
        }
      })
    },
    // 获取订单列表
    async fetchOrders() {
      this.loading = true;
      try {
        let datac = {}
        if(this.searchContent){
          datac = {...this.page,  orderId: this.searchContent}
        }else{
          datac = {...this.page}
        }
        let res = await orderList(datac)
        this.orderList = res.data.records
        this.page.total = parseInt(res.data.total)
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 获取统计数据
    async fetchStats() {
      // 模拟统计数据
      this.stats = {
        total: 128,
        pending: 12,
        paid: 25,
        shipped: 36,
        completed: 45,
        cancelled: 10
      };
    },

    // 搜索订单
    searchOrders() {
      this.pagination.page = 1;
      this.fetchOrders();
    },

    // 重置搜索
    resetSearch() {
      this.searchContent = '';
      this.pagination.page = 1;
      this.fetchOrders();
    },

    // 查看订单详情
    viewOrder(order) {
      // orderDetail({ id: order.id}).then(res => {
      //   this.currentOrder = res.data
      // })
      this.dialogVisible = true;
      order.productSnapshot = JSON.parse(order.productSnapshot)
      order.addrSnapshot = JSON.parse(order.addrSnapshot)
      // 模拟订单详情数据
      this.currentOrder = order
      console.log(this.currentOrder)
      this.productsData = [{name: order.productSnapshot.productName,
        price: order.productSnapshot.price,
        imgUrl: order.productSnapshot.mainImage}]
    },

    // 更新订单状态
    updateStatus(order, newStatus) {
      this.$confirm(`确认将订单状态更新为${this.getStatusText(newStatus)}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里应该调用API更新订单状态
        order.status = newStatus;
        this.$message.success('状态更新成功');
      });
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '买入订单',
        10: '待付款',
        100: '已付款',
        200: '交易失败',
      };
      return statusMap[status] || '未知';
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        pending: 'info',
        0: 'primary',
        10: 'warning',
        100: 'success',
        200: 'danger'
      };
      return typeMap[status] || 'info';
    },

    // 分页相关方法
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchOrders();
    },

    handleCurrentChange(val) {
      this.pagination.page = val;
      this.fetchOrders();
    }
  }
}
</script>

<style scoped lang="scss">
.search-box{
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  .search{
    font-size: 16px;
    color: #343A49;
    margin: 0 12px 0 6px;
  }
  .iconfont{
    color: #595959;
    font-size: 18px;
  }
  .search-btn{
    height: 30px;
    width: 56px;
    line-height: 30px;
    text-align: center;
    background-color: #66B98D;
    border-radius: 6px;
    font-size: 14px;
    color: #FFFFFF;
    cursor: pointer;
    margin-left: 20px;
  }
}
.order-management {
  padding: 20px;
}

.search-filter {
  background: #f5f7fa;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.order-stats {
  margin-bottom: 20px;
}

.stat-card {
  background: #ffffff;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.order-list {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.order-detail .detail-item {
  margin-bottom: 15px;
  font-size: 14px;
}

.order-detail .label {
  color: #606266;
  margin-right: 10px;
}

.order-detail .amount {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.product-list {
  margin-top: 20px;
}

.product-list h4 {
  margin-bottom: 15px;
  color: #303133;
}
</style>
