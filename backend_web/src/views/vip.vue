<template>
  <div>
    <!--        搜素-->
    <div class="search-box">
      <input type="file" id="upfile" name="upfile" @change="upload" style="position: absolute; left: -999px; top: -999px;">
      <div class="search-title"><span class="iconfont icon-sousu"></span><span class="search">搜素</span></div>
      <el-input v-model="searchContent" placeholder="联系方式/用户名" style="width: 200px"></el-input>
      <el-input v-model="searchAddress" placeholder="请输入地址" style="width: 200px;margin-left: 10px"></el-input>
      <div class="search-btn" @click="search">搜素</div>
      <div class="search-btn" @click="addForm">新增</div>
      <div class="search-btn" @click="exportExcel">导出</div>
      <div class="search-btn" @click="importExcel">导入</div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        width="55">-->
<!--      </el-table-column>-->
      <el-table-column
        label="日期"
        width="240">
        <template slot-scope="scope">{{ dealTime(scope.row.createtime) }}</template>
      </el-table-column>
      <el-table-column
        prop="vipname"
        label="用户名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        width="120">
      </el-table-column>
      <el-table-column
        prop="buynum"
        label="购买数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" style="margin-left: 4px" slot="reference" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <test></test>
    <!--        切换第几页-->
    <div style="text-align: center;padding: 15px 0">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :total="pageTotal">
      </el-pagination>
    </div>

<!--    弹窗-->
    <el-dialog :title="isedit ? '编辑会员' : '添加会员'" :visible.sync="dialogFormVisible">
<!--      <el-form ref="form" :model="form" label-width="80px">-->
        <el-row>
          <el-col :span="12" v-for="(item,index) in form.list" :key="index">
          <el-form-item label="用户名"
                        :rules=" [{required: true,message: '请输入货物名称',trigger: 'blur'}]"
                        :prop="`list.${index}.name`">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--          <el-form-item label="联系方式">-->
<!--            <el-input v-model="form.phone"></el-input>-->
<!--          </el-form-item>-->
<!--          </el-col>-->
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="数量">-->
<!--              <el-input v-model="form.buyNum"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-form-item label="地址">-->
<!--          <el-input type="textarea" v-model="form.address"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import test from './components/index'
  import {addVip, deleteVip, selectVip, upDateVip, vipExport, vipImport} from "../api/vip";
  import axios from "axios";
  import {getToken} from "../utils/auth";
  import {Encrypt} from "@/utils/secret";
  import {debounce} from "@/utils/utils";
  export default {
    name: 'vip',
    components:{
      test
    },
    data() {
      return {
        isedit:false,
        visibleDelete:false,
        deleteId:'',
        name:'',
        form: {
          phone:'',
          address:'',
          name:'',
          buyNum:'',
          list:[{
            name:''
          },{
            name:''
          }]
        },
        formLabelWidth: '120px',
        dialogFormVisible:false,
        searchContent:'',
        searchAddress:'',
        page:1,
        pageSize:10,
        pageTotal:null,//总数
        tableData: [],
        multipleSelection: []
      };
    },
   async created() {
      this.getVipData()
      console.log(Encrypt('{name:"张三"，age:23}'))
    },
    methods:{
      testData(){
        this.$refs['form'].validate((e) => {
          console.log(e)
        })
      },
      dealTime(time){
        return time.replace('T',' ')
      },
      getVipData(){
        let data = {
          page:this.page,
          rows:this.pageSize,
          name:this.searchContent,
          address:this.searchAddress
        }
        selectVip(data).then((res) => {
          this.tableData= res.data.records
          this.pageTotal = res.data.total
        })
      },
      addData(){
        if(this.isedit){//修改
          upDateVip(this.form).then((res) => {
            this.msgSuccess("修改成功!")
            this.dialogFormVisible = false;
            this.getVipData()
          })
        }else{//新增
          addVip(this.form).then(res => {
            this.msgSuccess("添加成功!")
            this.dialogFormVisible = false;
            this.getVipData()
          })
        }
      },
      addForm(){
        this.dialogFormVisible = true;
        this.form = {}
        this.isedit = false
      },
      search:debounce(function () {
        console.log(1111)
        var aaa = this
        console.log(aaa)
        console.log( this.page)
        this.getVipData()
      },1000),
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.isedit = true;
        this.form.id = row.id
        this.form.address = row.address;
        this.form.name = row.vipname;
        this.form.date = row.createtime;
        this.form.buyNum = row.buynum;
        this.form.phone = row.phone;
      },
      handleDelete(index, row) {
        this.$confirm('是否确认删除用户名为"' + row.vipname + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let data = {
            id:row.id
          }
          deleteVip(data).then((res) => {
            this.getVipData()
          })
        })
      },
      pageChange:function (index) {
        this.page = index;
        this.getVipData();
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
      },
      exportExcel(){
        let link = document.createElement('a');
        link.style.display = 'none'
        axios({
          url: "http://192.168.13.183:8888/vip/export",
          methods: "get",
          data: {},
          headers: {
            Authorization: getToken(),
          },
          responseType: 'blob',
        }).then((res) => {
          const blob = new Blob([res.data])
          const url = window.URL.createObjectURL(blob)
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          // let fileName = decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
          aLink.setAttribute('download', '用户表.xlsx')
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        })
      },
      importExcel(){
        document.getElementById("upfile").click();
      },
      upload(){
        let formData = new FormData();
        formData.append("file", document.getElementById("upfile").files[0]);
        vipImport(formData).then((res) => {
          this.getVipData()
        })
      }
    },
    // methods: {
//         // 获取 easy-mock 的模拟数据
//         getData() {
//             fetchData(this.query).then(res => {
//                 console.log(res);
//                 this.tableData = res.list;
//                 this.pageTotal = res.pageTotal || 50;
//             });
//         },
//         // 触发搜索按钮
//         handleSearch() {
//             this.$set(this.query, 'pageIndex', 1);
//             this.getData();
//         },
//         // 删除操作
//         handleDelete(index, row) {
//             // 二次确认删除
//             this.$confirm('确定要删除吗？', '提示', {
//                 type: 'warning'
//             })
//                 .then(() => {
//                     this.$message.success('删除成功');
//                     this.tableData.splice(index, 1);
//                 })
//                 .catch(() => {});
//         },
//         // 多选操作
//         handleSelectionChange(val) {
//             this.multipleSelection = val;
//         },
//         delAllSelection() {
//             const length = this.multipleSelection.length;
//             let str = '';
//             this.delList = this.delList.concat(this.multipleSelection);
//             for (let i = 0; i < length; i++) {
//                 str += this.multipleSelection[i].name + ' ';
//             }
//             this.$message.error(`删除了${str}`);
//             this.multipleSelection = [];
//         },
//         // 编辑操作
//         handleEdit(index, row) {
//             this.idx = index;
//             this.form = row;
//             this.editVisible = true;
//         },
//         // 保存编辑
//         saveEdit() {
//             this.editVisible = false;
//             this.$message.success(`修改第 ${this.idx + 1} 行成功`);
//             this.$set(this.tableData, this.idx, this.form);
//         },
//         // 分页导航
//         handlePageChange(val) {
//             this.$set(this.query, 'pageIndex', val);
//             this.getData();
//         }
//     }
  };
</script>

<style scoped lang="scss">
  .test{
  }
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
  /*.handle-box {*/
  /*    margin-bottom: 20px;*/
  /*}*/

  /*.handle-select {*/
  /*    width: 120px;*/
  /*}*/

  /*.handle-input {*/
  /*    width: 300px;*/
  /*    display: inline-block;*/
  /*}*/
  /*.table {*/
  /*    width: 100%;*/
  /*    font-size: 14px;*/
  /*}*/
  /*.red {*/
  /*    color: #ff0000;*/
  /*}*/
  /*.mr10 {*/
  /*    margin-right: 10px;*/
  /*}*/
  /*.table-td-thumb {*/
  /*    display: block;*/
  /*    margin: auto;*/
  /*    width: 40px;*/
  /*    height: 40px;*/
  /*}*/
</style>
