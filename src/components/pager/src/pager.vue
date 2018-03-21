<template>
  <div style="display: flex; margin-top: 20px">
    <el-pagination
      v-bind="this.$props"
      @current-change="currentChange"
      ref="page"
    >
    </el-pagination>
    <el-button size="small" type="primary" style="margin-left: 20px" @click="jumping">跳转</el-button>
  </div>
</template>
<script>

export default {
  name: 'pager',
  props: ['currentChange', 'pageSize', 'layout', 'total'],
  data () {
    return {
      aaa: 1
    }
  },
  mounted () {
    /*eslint-disable*/
    // this.$refs.page.$children[4].handleChange = function (e) {
    //   return ;
    // }
    // this.$refs.page.$children[4].handleBlur = function (e) {
    //   return ;
    // }
    // document.querySelectorAll('.el-pagination__editor')[0].addEventListener('input', function () {
    //   return
    // })
  },
  methods: {
    jumping() {
      if(this.$refs.page.$children[4].$children[0].max < this.$refs.page.$children[4].$children[0].currentValue) {
        this.$refs.page.$children[4].$refs.input.$el.querySelector('input').value = this.$refs.page.$children[4].$children[0].currentValue;
        this.$message({
          type: 'error',
          message: '超出最大页数'
        });
      }else {
        this.$refs.page.$children[4].$parent.internalCurrentPage = this.$refs.page.$children[4].$parent.getValidCurrentPage(this.$refs.page.$children[4].$children[0].currentValue);
        this.$refs.page.$children[4].oldValue = null;
      }

    }
  }

};

</script>
