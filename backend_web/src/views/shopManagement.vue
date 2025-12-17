<template>
  <div>
    <!--        搜素-->
    <div class="search-section">
      <el-input
        v-model.trim="searchContent"
        placeholder="请输入标题"
        style="width: 300px;"
        clearable
      />
      <el-button type="primary" @click="searchContentData()">搜索</el-button>
      <el-button @click="restSearchContentData">重置</el-button>
    </div>
    <div class="action-buttons" style="margin-top: 20px">
      <el-button type="primary" @click="handleEdit({id: null,
          productName: '',
          price: 0,
          subImages: '',
          belongMobile:'',})">新增商品</el-button>
      <el-button type="danger" @click="zSell()"  icon="el-icon-position">一键转卖</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        width="180"
        prop="mainImage"
        label="图片">
        <template slot-scope="scope">
          <img style="width: 100px;height: 100px" :src="scope.row.mainImage" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="标题"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        width="120"
        prop="price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="belongMobile"
        label="所属人">
      </el-table-column>
      <el-table-column
        prop="status"
        width="120"
        label="状态">
        <template #default="{row}">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
<!--          <el-button-->
<!--          v-if="scope.row.status == 3"-->
<!--          size="mini"-->
<!--          @click="handleView(scope.row)">转卖</el-button>-->
<!--          <el-button-->
<!--            v-if="scope.row.status == 2"-->
<!--            size="mini"-->
<!--            @click="handleCom(scope.row)">交易完成</el-button>-->
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--        切换第几页-->
    <div style="margin-top: 10px;display: flex;width: 100%;justify-content: flex-end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.page"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!--        弹窗-->
    <Dialog title="查看订单详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </Dialog>
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="600px">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="商品标题" prop="productName">
          <el-input v-model="editForm.productName" placeholder="请输入商品标题"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="editForm.price" :precision="2" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="所属人" prop="belongMobile">
          <el-input v-model="editForm.belongMobile" placeholder="请输入所属人"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <el-upload
            class="image-uploader"
            action="http://wmirw.pazmm.com:88/api/tob/image/uploadToOss"
            :file-list="editForm.subImages"
            list-type="picture-card"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-preview="handlePicturePreview"
            :on-remove="handlePictureRemove"
            :on-success="handlePictureSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="upload-tips">最少上传1张</div>
        </el-form-item>
        <el-form-item label="商品描述">
          <QuillEditor v-model="editForm.productDesc" :options="editForm"></QuillEditor>
        </el-form-item>
<!--        <el-form-item label="商品图片">-->
<!--          <el-upload-->
<!--            class="avatar-uploader"-->
<!--            action="#"-->
<!--            :show-file-list="false"-->
<!--            :on-change="handleAvatarSuccess"-->
<!--            :before-upload="beforeAvatarUpload">-->
<!--            <img v-if="editForm.mainImage" :src="editForm.mainImage" class="avatar">-->
<!--            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {Pagination,Dialog} from "element-ui";
  import {productList, saveProduct, deleteProduct, reSaleBatch} from '@/api/shop'
  import { saveUser } from '../api/user'
  import { makeOrderComplete, productReSale } from '../api/shop'
  export default {
    name: 'shopManagement',
    components:{
      Pagination,
      Dialog,
    },
    data() {
      return {
        editDialogVisible: false,
        headers: {
          Authorization: localStorage.getItem('token')
        },
        rules: {
          productName: [
            { required: true, message: '请输入商品标题', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入商品价格', trigger: 'change' },
            { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'change' }
          ],
          belongMobile: [
            { required: true, message: '请输入所属人', trigger: 'blur' },
          ]
        },
        editForm: {
          id: '',
          productName: '',
          price: 0,
          subImages: [],
          belongMobile:'',
          productDesc: ''
        },
        page:{
          page: 1,
          pageSize: 10,
          total: null
        },
        gridData:[],
        searchContent:'',
        pageTotal:1000,//总数
        dialogTableVisible: false,
        tableData: [],
        multipleSelection: []
      };
    },
    created() {
      this.getData();
    },
    methods:{
      zSell(){
        this.$confirm('此操作将转卖所有已交易完成的商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reSaleBatch({}).then(res => {
            this.getData();
            this.$message.success('操作成功');
          })
        }).catch(() => {})
      },
      getStatusText(status) {
        const statusMap = {
          1: '在售',
          2: '交易中',
          3: '交易成功',
        };
        return statusMap[status] || '未知';
      },
      getStatusType(status) {
        const typeMap = {
          1: 'primary',
          3: 'success',
          2: 'danger'
        };
        return typeMap[status] || 'info';
      },
      searchContentData(){
        this.page.page = 1
        this.getData();
      },
      restSearchContentData(){
        this.searchContent = ''
        this.page.page = 1
        this.getData();
      },
      saveEdit(){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if(!this.editForm.subImages.length){
              this.$message.error('请上传商品图片')
              return
            }
            // 表单验证通过，执行保存逻辑
            let data = JSON.parse(JSON.stringify(this.editForm))
            data.mainImage = data.subImages[0].url
            data.subImages = data.subImages.map(item => item.url).join(',')
            saveProduct(data).then(res => {
                this.$message.success('操作成功');
                this.editDialogVisible = false;
                this.getData(); // 重新加载数据
            }).catch(error => {
              this.$message.error('保存失败: ' + error.message);
            });
          } else {
            // 表单验证不通过
            this.$message.warning('请填写正确的表单信息');
            return false;
          }
        });
        // saveProduct(this.editForm)
        console.log(this.editForm)
      },
      beforeUpload(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const isAllowedType = allowedTypes.includes(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isAllowedType) {
          this.$message.error('只能上传 JPG/PNG/GIF 格式的图片！');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!');
          return false;
        }
        return true;
      },
      handlePicturePreview(file) {
        this.previewImageUrl = file.url;
        this.previewDialogVisible = true;
      },

      handlePictureRemove(file, fileList) {
        this.editForm.subImages = fileList;
      },

      handlePictureSuccess(response, file, fileList) {
        if (response && response.data) {
          console.log(fileList)
         const pp =  fileList.map(item => ({
            url: item?.response?.data || item.url,
          }));
          this.editForm.subImages = [...this.editForm.subImages, ...pp]
        }
        console.log(this.editForm.subImages)
        // 实际应用中应从response获取返回的图片URL
        // this.editForm.subImages = fileList;
      },
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.page.page = val;
        this.getData();
      },
      getData(){
        productList({...this.page,productName: this.searchContent}).then(res => {
          this.tableData = res.data.records
          this.page.total = parseInt(res.data.total)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(row) {
        this.editDialogVisible = true;
        // 转换图片数据格式以支持回显
        if (row.subImages) {
          const imageUrls = row.subImages.split(',');
          this.editForm.subImages = imageUrls.map(url => ({
            url: url,
            name: url
          }));
        } else {
          this.editForm.subImages = [];
        }
        this.editForm = { ...row, subImages: this.editForm.subImages };
      },
      handleView(row){
        this.$confirm('确定要转卖商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            // 这里应该调用实际的API接口
            // await this.$api.deleteUser(row.id);
            productReSale({id:row.id}).then(res => {
              this.$message.success('操作成功');
              this.getData();
            })
          }
          catch (error) {
            console.error(error);
          }
        });
      },
      handleDelete(row) {
        this.$confirm('确定要删除该商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            // 这里应该调用实际的API接口
            // await this.$api.deleteUser(row.id);
            deleteProduct({id:row.id}).then(res => {
              this.$message.success('删除成功');
              this.getData();
            })
          }
          catch (error) {
            console.error(error);
          }
        });
      },
      pageChange:function (index) {
        window.console.log(index)
        //window.console.log(index)
        // this.pageCurrent = index
        // let start = (index-1)*10
        // let self =this
        // getArticleList({
        //     start: start,
        //     size: 10,
        //     plate: 0,
        //     type: this.tagType,
        //     token:getToken()
        // }).then(res=>{
        //     self.articleListData = res.data.data.data
        //     self.pageTotal = Math.ceil(res.data.data.total/10)*10
        // })
      }
    }
  };
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
</style>
