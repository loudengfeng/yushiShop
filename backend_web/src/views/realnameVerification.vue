<template>
  <div class="user-management">
    <!--    <h2>用户管理</h2>-->

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-input
        v-model.trim="searchForm.keyword"
        placeholder="请输入手机号"
        style="width: 300px;"
        clearable
      />
      <el-button type="primary" @click="searchUsers">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 操作按钮区域 -->
<!--    <div class="action-buttons">-->
<!--      <el-button type="primary" @click="addUser">新增用户</el-button>-->
<!--    </div>-->

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
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="nameSign" label="签名图片">
        <template slot-scope="scope">
          <img style="width: 100px;height: 100px" :src="scope.row.nameSign" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="auditStatus" label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditStatus == 1 ? '通过' : scope.row.auditStatus == 0 ? '审核中' : '拒绝'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <el-button size="small" @click="editUser(row)">审核</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="currentUser" :rules="rules" ref="userForm">
        <el-form-item label="审核状态">
          <el-select v-model="currentUser.auditStatus" placeholder="请选择">
            <el-option label="同意" :value="1"></el-option>
            <el-option label="拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核原因">
          <el-input type="textarea" v-model="currentUser.auditReason"></el-input>
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
  import { userIdentity, userIdentityAudit } from '../api/user'

  export default {
    name: "user",
    data() {
      return {
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
          auditStatus: '1',
          auditReason: ''
        },
        rules: {
          realName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          userMobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      // 获取用户列表
      async fetchUsers() {
        this.loading = true;
        try {
          const response = await userIdentity({
            page: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            mobile: this.searchForm.keyword
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
      // addUser() {
      //   this.dialogTitle = '新增用户';
      //   this.currentUser = { id: null, userMobile: '', realName: ''};
      //   this.dialogVisible = true;
      // },

      // 编辑用户
      editUser(row) {
        this.dialogTitle = '审核';
        this.currentUser.auditStatus
        if(row.auditStatus == 0){
          this.currentUser.auditStatus = ''
        }else{
          this.currentUser = { ...row };
        }
        this.currentUser.id = row.id
        this.dialogVisible = true;
      },

      // 保存用户
      saveUser() {
        userIdentityAudit(this.currentUser).then(res => {
          if(res.code == '000000'){
            this.$message.success('操作成功');
            this.fetchUsers()
            this.dialogVisible = false
          }else{
            this.$message.error(res.msg)
          }
        })
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
