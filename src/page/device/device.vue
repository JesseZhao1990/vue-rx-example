<template>
<div class="content-wrap">
    <el-form ref="form" :inline="true" :model="form" size="small">
    <el-form-item label="集团名称">
        <el-input @keypress.native="keypress" v-model="form.keywords" placeholder="请输入集团名称"></el-input>
    </el-form-item>
    <el-form-item @keypress.native="keypress" label="集团ID">
        <el-input v-model="form.groupId" placeholder="请输入集团ID"></el-input>
    </el-form-item>
    <el-form-item @keypress.native="keypress" label="店铺ID">
        <el-input v-model="form.shopId" placeholder="请输入店铺ID"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="search" size="small">搜索</el-button>
    </el-form-item>
    </el-form>
<div>

<el-table
    :data="tableData"
    v-loading="loading"
    border
    max-height="600">
    <el-table-column
      prop="groupId"
      label="集团ID"
      width="150">
    </el-table-column>
    <el-table-column
      prop="groupName"
      label="集团名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="店铺地址"
      width="250">
    </el-table-column>
    <el-table-column
      prop="name"
      label="店铺名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="100">
    </el-table-column>
    <el-table-column
      prop="deviceCount"
      label="设备数量"
      >
    </el-table-column>
  </el-table>

  <div class="page">
    <el-pagination
      @size-change="handleCurrentChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNo"
      :page-size="page.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="page.totalCount">
    </el-pagination>
  </div>

  </div>
</div>
</template>

<script>
import Rx from 'rxjs/Rx'
import deviceApi from '../../api/device'
export default {
  data () {
    return {
      form: {
        keywords: '',
        groupId: '',
        shopId: ''
      },
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 20,
        totalCount: 1
      },
      loading: false,

      dialogVisible: false,
      row: {}
    }
  },
  observableMethods: {
    search: 'search$',
    handleCurrentChange: 'handleCurrentChange$'
  },
  subscriptions () {
    const created$ = this.$eventToObservable('hook:created')
      .map(() => ({
        name: 'created',
        data: { pageNo: 1 }
      }))
    const search$ = this.search$
      .debounceTime(500)
      .do(() => {
        this.page.pageNo = 1
      })
      .map(() => {
        const {
          form: { groupId, shopId, keywords: groupName },
          page: { pageNo }
        } = this
        return {
          name: 'search',
          data: {
            groupId, shopId, groupName, pageNo
          }
        }
      })

    const handleCurrentChange$ = this.handleCurrentChange$
      .debounceTime(500)
      .skipWhile(currentPage => this.page.pageNo === currentPage)
      .map((currentPage) => {
        const { form: { groupId, shopId }, preData: { reqData: { data: { groupName } } } } = this
        return {
          name: 'handleCurrentChange',
          data: {
            groupId, shopId, groupName, pageNo: currentPage
          }
        }
      })

    return {
      preData: Rx.Observable.merge(created$, search$, handleCurrentChange$)
        // 开始加载
        .do(() => {
          this.loading = true
        })
        // 请求数据
        .switchMap(
          d => Rx.Observable.fromPromise(deviceApi.getTerminalDevicesWithShop(d.data)),
          (outerValue, innerValue) => ({ reqData: outerValue, rspData: innerValue })
        )
        .catch((error) => {
          this.loading = false
          this.$message({
            message: `查询失败，具体原因：${error}`,
            type: 'error'
          })
          throw new Error(error)
        })
        // 处理数据
        .do((rs) => {
          let rsp = rs.rspData
          rsp = this.formatRsp(rsp)
          this.tableData = rsp.data ? rsp.data : []
          if (rsp.page) {
            this.page = rsp.page
          }
          this.loading = false
        })
    }
  },
  methods: {
    /** 格式化返回的数据 */
    formatRsp (rsp) {
      if (rsp && rsp.data) {
        const data = rsp.data.map(item =>
          Object.assign({}, item, {
            status: String(item.status) === '0' ? '下线' : '上线'
          }))
        return Object.assign({}, rsp, { data })
      }
      return rsp
    },

    keypress (event) {
      if (event.keyCode === 13) {
        this.search()
      }
    }
  }
}
</script>

<style scoped>
.content-wrap {
  margin: 20px;
}
.page {
  margin-top: 20px;
}
</style>
