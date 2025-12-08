<template>
  <div class="shop-add-container">
    <h2 class="page-title">商品新增</h2>

    <el-card class="form-card">
      <el-form
          :model="productForm"
          :rules="rules"
          ref="productForm"
          label-width="120px"
          class="product-form"
      >
        <!-- 基本信息 -->
        <el-form-item label="商品名称" prop="name">
          <el-input
              v-model="productForm.name"
              placeholder="请输入商品名称"
          />
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number
              v-model="productForm.price"
              :min="0"
              :precision="2"
              :step="0.1"
              controls-position="right"
          />
        </el-form-item>

        <!-- 商品图片上传 -->
        <el-form-item label="商品图片" prop="images">
          <el-upload
              class="image-uploader"
              action="/api/upload"
              :file-list="productForm.images"
              list-type="picture-card"
              :on-preview="handlePicturePreview"
              :on-remove="handlePictureRemove"
              :on-success="handlePictureSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="upload-tips">最多可上传5张图片，建议尺寸800*800像素</div>
        </el-form-item>

        <!-- 商品详情 -->
        <el-form-item label="商品描述" prop="description">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入商品详细描述"
              v-model="productForm.description">
          </el-input>
        </el-form-item>

        <!-- 商品状态 -->
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm('productForm')">保存商品</el-button>
          <el-button @click="resetForm('productForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="previewDialogVisible" title="图片预览">
      <img width="100%" :src="previewImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "shopAdd",
  data() {
    return {
      productForm: {
        name: '',
        price: 0,
        images: [],
        description: '',
        status: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ]
      },
      previewDialogVisible: false,
      previewImageUrl: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交商品数据
          console.log('提交商品:', this.productForm);
          this.$message.success('商品保存成功');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handlePicturePreview(file) {
      this.previewImageUrl = file.url;
      this.previewDialogVisible = true;
    },

    handlePictureRemove(file, fileList) {
      this.productForm.images = fileList;
    },

    handlePictureSuccess(response, file, fileList) {
      // 实际应用中应从response获取返回的图片URL
      this.productForm.images = fileList;
    }
  }
}
</script>

<style scoped>
.shop-add-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.page-title {
  color: #303133;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 500;
}

.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-form {
  padding: 20px;
}

.image-uploader >>> .el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 120px;
}

.image-uploader >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 120px;
  height: 120px;
}

.upload-tips {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions >>> .el-form-item__content {
  margin-left: 0 !important;
}

/deep/ .el-card__body {
  padding: 0;
}
</style>
