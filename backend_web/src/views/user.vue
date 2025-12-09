<template>
  <div class="user-management">
<!--    <h2>用户管理</h2>-->

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-input
          v-model.trim="searchForm.keyword"
          placeholder="请输入用户名"
          style="width: 300px;"
          clearable
      />
      <el-button type="primary" @click="searchUsers">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button type="primary" @click="addUser">新增用户</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
        :data="userList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        border
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column prop="realName" label="用户名"></el-table-column>
      <el-table-column prop="userMobile" label="手机号码"></el-table-column>
      <el-table-column prop="inviterName" label="邀请人"></el-table-column>
      <el-table-column prop="teamName" label="所属团队"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <el-button size="small" @click="editUser(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
    </el-pagination>

    <!-- 用户编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="650px">
      <el-form :model="currentUser" :rules="rules" ref="userForm" :label-position="labelPosition">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="realName" style="display: flex">
              <el-input v-model="currentUser.realName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="userMobile" style="display: flex">
              <el-input v-model="currentUser.userMobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邀请人" prop="inviterName" style="display: flex">
              <el-input v-model="currentUser.inviterName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属团队" prop="teamName" style="display: flex">
              <el-input v-model="currentUser.teamName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="购买时间" style="display: flex" prop="canBuyEnd">
<!--          <el-col :span="11">-->
<!--            <el-date-picker type="datetime" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss" v-model="currentUser.canBuyStart" style="width: 100%;"></el-date-picker>-->
<!--          </el-col>-->
<!--          <el-col class="line" :span="2">-</el-col>-->
<!--          <el-col :span="11">-->
<!--            <el-date-picker type="datetime" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss" v-model="currentUser.canBuyEnd" style="width: 100%;"></el-date-picker>-->
<!--          </el-col>-->
          <el-time-picker
            value-format="HH:mm:ss"
            v-model="currentUser.canBuyStart"
            :picker-options="{
                selectableRange: '00:00:00 - 23:45:00'
              }"
            placeholder="起始时间">
          </el-time-picker>
          <span style="margin-right: 10px;margin-left: 10px">-</span>
          <el-time-picker
            arrow-control
            value-format="HH:mm:ss"
            v-model="currentUser.canBuyEnd"
                    :picker-options="{
              selectableRange: '00:00:00 - 23:45:00',
              minTime: currentUser.canBuyStart
            }"
            placeholder="结束时间">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { saveUser, userList } from '@/api/user'

export default {
  name: "user",
  data() {
    return {
      labelPosition: 'right',
      searchForm: {
        keyword: ''
      },
      loading: false,
      userList: [],
      multipleSelection: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      currentUser: {
        id: null,
        userMobile: '',
        realName: '',
        status: '1',
        loginPassword:'123456',
        inviterName: '',
        teamName: '',
        canBuyStart: '',
        canBuyEnd: '',
      },
      rules: {
        realName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        inviterName: [
          { required: true, message: '请输入邀请人', trigger: 'blur' }
        ],
        teamName: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ],
        canBuyEnd: [
          { required: true, message: '请选择购买时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    // formatCurrentTime() {
      // const now = new Date();
      // const hour = this.padZero(now.getHours());
      // const minute = this.padZero(now.getMinutes());
      // const second = this.padZero(now.getSeconds());
      // this.currentUser.canBuyStart = `${hour}:${minute}:${second}`;
    // },
    // 补零函数（确保个位数为两位）
    // padZero(num) {
    //   return num < 10 ? `0${num}` : num;
    // },
    // 获取用户列表
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await userList({
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          realName: this.searchForm.keyword
        });
        console.log(response.data)
        this.userList = response.data.records;
        this.pagination.total = parseInt(response.data.total);

        // 模拟数据
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // 搜索用户
    searchUsers() {
      this.pagination.currentPage = 1;
      this.fetchUsers();
    },

    // 重置搜索
    resetSearch() {
      this.searchForm.keyword = '';
      this.pagination.currentPage = 1;
      this.fetchUsers();
    },

    // 新增用户
    addUser() {
      this.dialogTitle = '新增用户';
      this.currentUser = { id: null, userMobile: '', realName: '',status: '1',loginPassword:'123456'};
      this.dialogVisible = true;
      // this.formatCurrentTime()
    },

    // 编辑用户
    editUser(row) {
      this.dialogTitle = '编辑用户';
      this.currentUser = { ...row };
      this.dialogVisible = true;
    },
    isStartTimeGreaterThanEndTime(startTime, endTime) {
      // 1. 转换为 Date 对象并校验合法性

      // 2. 转换为时间戳（毫秒级）对比
      const startTimestamp = new Date(startTime).getTime();
      const endTimestamp = new Date(endTime).getTime();
     return startTimestamp > endTimestamp;
    },
    // 保存用户
    saveUser() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          try {
            const myreg=/^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
            if(!myreg.test(this.currentUser.userMobile)){
              return this.$message.error('请输入正确的手机号码');
            }
            // let pp = this.isStartTimeGreaterThanEndTime(this.currentUser.canBuyStart,this.currentUser.canBuyEnd)
            // if(pp){
            //   return this.$message.error('开始时间要大于结束时间');
            // }
            if(!this.currentUser.canBuyStart){
              return this.$message.error('请选择购买时间');
            }
            if(!this.currentUser.canBuyEnd){
              return this.$message.error('请选择购买时间');
            }
            saveUser(this.currentUser).then(res => {
              this.dialogVisible = false;
              this.$message.success('操作成功');
              this.fetchUsers()
            })
          } catch (error) {
            console.error(error);
          }
        }
      });
    },

    // 删除用户
    deleteUser(row) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 这里应该调用实际的API接口
          // await this.$api.deleteUser(row.id);
          saveUser({id:row.id,deleted: 1}).then(res => {
            this.$message.success('删除成功');
            this.fetchUsers();
          })
        }
        catch (error) {
          console.error(error);
        }
      });
    },

    // 批量删除
    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择要删除的用户');
        return;
      }

      this.$confirm(`确定要删除选中的 ${this.multipleSelection.length} 个用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 这里应该调用实际的API接口
          // const ids = this.multipleSelection.map(item => item.id);
          // await this.$api.batchDeleteUsers(ids);

          this.$message.success('删除成功');
          this.fetchUsers();
        } catch (error) {
          console.error(error);
        }
      });
    },

    // 处理多选
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchUsers();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchUsers();
    }
  }
}
</script>

<style scoped lang="scss">
.user-management {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.action-buttons {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
