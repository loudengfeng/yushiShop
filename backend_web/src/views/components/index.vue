<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-row>
      <el-col :span="12" v-for="(item,index) in form.list" :key="index">
        <el-form-item label="用户名"
                      :rules=" [{required: true,message: '请输入货物名称',trigger: 'blur'}]"
                      :prop="`list.${index}.name`">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-button @click="testData">按钮</el-button>
  </el-form>
</template>

<script>
export default {
  name: "index",
  data(){
    return{
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
    }
  },
  methods:{
    testData(){
      this.$refs['form'].validate((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>