<!-- 如果编辑器不能针对.vue生成对应的模板的情况下，该文件可供外部复用-->
<!-- 根据需要做修改，并且把不需要用到的函数注释删除 -->
<!-- vue2.x的更多详情可参照 https://vuefe.cn/v2/guide/ -->

<template>
  <div class="portfolio">
    <div class="portfolio-head">
      开市 <i class="el-icon-more" style="padding:0 20px;"></i>
    </div>
    <div class="portfolio-section" v-show="portfolioSection">
        <div class="section-left-title">
          <h4>投资组合</h4>
          <i class="el-icon-close" @click="closeClick" style="font-size: 30px;"></i>
        </div>
        <div class="section-left-tab">
          <div class="tab-left">
            <div>
              <h5>总资产</h5>
              <p>{{accountCapitalInfo.TotalAsset.toFixed(2)}}</p>
            </div>
            <div>
              <h5>现金结余</h5>
              <p>{{accountCapitalInfo.TotalAmount.toFixed(2)}}</p>
            </div>
            <div>
              <h5>可用现金 / 冻结现金</h5>
              <p>{{accountCapitalInfo.AvailableCashAmount.toFixed(2)}} / {{accountCapitalInfo.FreezeAmount.toFixed(2)}}</p>
            </div>
          </div>
          <div class="tab-right">
            <button type="button" @click="refreshClick" v-loading.fullscreen.lock="fullscreenLoading">刷新</button>
            <button type="button" @click="buyClick">买入</button>
            <button type="button">卖出</button>
          </div>
        </div>
        <div class="section-left-list">
          <div class="list-top">
            <div v-for="(item, index) in list" :key="index">{{item.name}}</div>
          </div>
          <ul class="list-main">
            <li v-for="(item, index) in items" :key="index">
              <div @click="listClick(item, index)" :class="{activeBg:index===currentIndex}">
                <div>
                  <div>
                    <span>{{item.Cname}}</span>
                    <span>{{item.Symbol}}</span>
                  </div>
                  <i v-if="item.buyList.length" :class="[item.Invalid?'el-icon-arrow-up':'el-icon-arrow-down']" style="font-size: 20px;padding-top:10px;" @click.stop="iconClick(item, index)"></i>
                </div>
                <div>
                  <h5>{{item.Volume.toFixed(2)}}</h5>
                  <h5>{{item.SellableVolume.toFixed(2)}}</h5>
                </div>
                <div>
                  {{item.AverageCost.toFixed(2)}}
                </div>
                <div>
                  <h5>{{item.CurrentPrice.toFixed(2)}}</h5>
                  <h5 :class="[item.ChangePercentage>0?'green':item.ChangePercentage===0?'':'red']">{{item.ChangePercentage===0?0:(item.ChangePercentage*100).toFixed(3)}}%</h5>
                </div>
                <div>
                  {{item.MarketValue.toFixed(2)}}
                </div>
                <div>
                  {{item.Charge.toFixed(2)}}
                </div>
                <div>
                  <h5 :class="[item.Profit<0?'red':'']">{{item.Profit.toFixed(2)}}</h5>
                  <h5 :class="[item.TempProfitPercentage>0?'green':item.TempProfitPercentage===0?'':'red']">{{item.TempProfitPercentage===0?0:(item.TempProfitPercentage*100).toFixed(3)}}%</h5>
                </div>
                <div>
                  <i :class="icon(item.Status)"></i>
                  <h4>{{item.Status | gameStatus}}</h4>
                </div>
              </div>
              <ul class="li-position" v-show="item.Invalid">
                <li v-for="(value, key) in item.buyList" :key="key">
                  <span>{{value.OrderType}}</span>
                  <span style="padding-left:30px">指令数量: {{value.Volume}}</span>
                  <span style="padding-left:30px">价格: {{Number(value.Price).toFixed(2)}}</span>
                  <span>剩余有效天数: {{value.dayCount}}</span>
                  <span style="width:7%;">{{value.date}}</span>
                  <button @click.stop="cancelClick(item, value)">撤销</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <el-dialog
          title="买入股票界面"
          :visible.sync="visible"
          width="80%"
          :show-close="false"
          center>
          <el-form ref="form" :inline="true" :model="form" style="text-align:center;" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="出价方式">
                  <el-input v-model="form.OrderType">
                  </el-input>
                </el-form-item>
                <el-form-item label="限价交易">
                  <el-input v-model="form.Price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="指定数量">
                  <el-input v-model="form.Volume">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="有效天数">
                  <el-input v-model="form.dayCount" :disabled="true">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="选择日期">
                  <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.date" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="股票列表">
                  <el-select v-model="form.list" clearable filterable @change="portfolioListClick" placeholder="请选择股票">
                    <el-option v-for="(item, index) in portfolioList" :label="item.Cname" :value="item.Symbol" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <span class="dialog-footer">
                  <el-button @click="cancel">取 消</el-button>
                  <el-button type="primary" @click="onSubmit">提交</el-button>
                </span>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="portfolioNewPriceList"
                style="width: 100%">
                <el-table-column
                  prop="Symbol"
                  label="股票编号"
                  align="center"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="ClosePrice"
                  label="收市价(元)"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="OpenPrice"
                  align="center"
                  label="开市价(元)">
                </el-table-column>
                <el-table-column
                  prop="PrvClosePrice"
                  align="center"
                  label="前日收市价(元)">
                </el-table-column>
                <el-table-column
                  prop="HighPrice"
                  align="center"
                  label="最高价(元)"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="LowPrice"
                  align="center"
                  label="最低价(元)">
                </el-table-column>
                <el-table-column
                  prop="Date"
                  align="center"
                  :formatter="formatDate"
                  label="报价时间">
                </el-table-column>
                <el-table-column
                  prop="Turnover"
                  align="center"
                  label="成交额(元)">
                </el-table-column>
                <el-table-column
                  prop="Volume"
                  align="center"
                  label="成交量(次)">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import { _formatDate } from '@/assets/js'
const opkey = 'f497ba51-c0c7-443f-94e7-ca6d736ff89e'
const accountId = '4f6f1d13-3cc8-440e-a19f-ad18458875fd'
export default {
  // 组件的名称
  name: 'portfolio',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data () {
    return {
      // loading
      fullscreenLoading: false,
      // 资金对象数据
      accountCapitalInfo: {
        TotalAsset: 0,
        TotalAmount: 0,
        AvailableCashAmount: 0,
        FreezeAmount: 0
      },
      // 控制投资组合主体内容是否显示
      portfolioSection: true,
      isTrue: false,
      list: [
        { id: '1', name: '股票' },
        { id: '2', name: '持股数量 / 可交易数' },
        { id: '3', name: '平均成本价' },
        { id: '4', name: '当前价' },
        { id: '5', name: '市值' },
        { id: '6', name: '交易佣金' },
        { id: '7', name: '盈利' },
        { id: '8', name: '状态' }
      ],
      items: [],
      currentIndex: -1,
      // itemObj: {},
      // dialog 对话框的显示
      visible: false,
      // 每一条的投资组合买入的数组
      buyList: [
        { id: 1, type: '手动买入中', count: 400, price: 33, dayCount: 1, date: '2018-20-2' }
      ],
      buyListId: 1,
      // 股票列表
      portfolioList: [],
      // 股票最新报价
      portfolioNewPriceList: [],
      form: {
        id: null,
        list: null,
        Volume: 0,
        Price: 0,
        dayCount: 1,
        OrderType: '',
        date: ''
      },
      // 定时器
      timer: null
    }
  },

  // 组件
  components: {},

  // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
  // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined

  // 方法
  methods: {
    // 格式化时间
    formatDate (val) {
      let t = val.Date.slice(6, 19)
      let NewDtime = new Date(parseInt(t))
      return _formatDate(NewDtime)
    },
    // 获取右侧数据的方法
    _getAccountPortfolioInfos () {
      let params = {
        opkey: opkey,
        accountId: accountId
      }
      return new Promise((resolve, reject) => {
        api.getAccountPortfolioInfos(params).then((res) => {
          resolve(res.data.Items)
        })
      })
      // api.getAccountPortfolioInfos(params).then((res) => {
      // this.rightArr = res.data.Items
      // this.items = res.data.Items.map((item) => {
      //   let obj = {
      //     AverageCost: item.AverageCost,
      //     AverageTradePrice: item.AverageTradePrice,
      //     ChangePercentage: item.ChangePercentage,
      //     Charge: item.Charge,
      //     CurrentPrice: item.CurrentPrice,
      //     HoldingDate: item.HoldingDate,
      //     HoldingDays: item.HoldingDays,
      //     Invalid: item.Invalid,
      //     LastUpdateTime: item.LastUpdateTime,
      //     Market: item.Market,
      //     MarketValue: item.MarketValue,
      //     MergeState: item.MergeState,
      //     MonitorStrategyId: item.MonitorStrategyId,
      //     MonitorStrategyName: item.MonitorStrategyName,
      //     ProductType: item.ProductType,
      //     Profit: item.Profit,
      //     SellableVolume: item.SellableVolume,
      //     Status: item.Status,
      //     Symbol: item.Symbol,
      //     TempProfitPercentage: item.TempProfitPercentage,
      //     TotalVolume: item.TotalVolume,
      //     TradeStatus: item.TradeStatus,
      //     Volume: item.Volume,
      //     Id: item.Id,
      //     buyList: []
      //   }
      //   return obj
      // })
      // })
    },
    // 资金查询接口
    _getAccountCapitalById () {
      let params = {
        opkey: opkey,
        accountId: accountId
      }
      return new Promise((resolve, reject) => {
        api.getAccountCapitalById(params).then((res) => {
          resolve(res.data)
        })
      })
    },
    // 获取左侧股票列表的方法
    _getStockList () {
      let params = {
        opkey: opkey,
        market: 'HKEX'
      }
      return new Promise((resolve, reject) => {
        api.getStockList(params).then((res) => {
          resolve(res.data.Items)
        })
      })
    },
    // 拼接左侧股票列表和右侧数据的方法
    _concatData () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const promiseGetStockList = this._getStockList()
      const promiseGetAccountPortfolioInfos = this._getAccountPortfolioInfos()
      Promise.all([
        promiseGetStockList,
        promiseGetAccountPortfolioInfos
      ]).then(([leftArr, rightArr]) => {
        for (let j = 0; j < leftArr.length; j++) {
          for (let i = 0; i < rightArr.length; i++) {
            if (rightArr[i].Symbol === leftArr[j].Symbol) {
              this.items.push(Object.assign({}, rightArr[i], leftArr[j], { buyList: [] }))
            }
          }
        }
        // leftArr.forEach((item) => {
        //   for (let i = 0; i < rightArr.length; i++) {
        //     if (rightArr[i].Symbol === item.Symbol) {
        //       this.items.push(Object.assign({}, rightArr[i], item, { buyList: [] }))
        //     }
        //   }
        // })
        console.log(this.items)
        this.portfolioList = leftArr
      })
      loading.close()
    },
    // 获取股票最新报价的数据
    _getStockPrice (symbol) {
      let params = {
        opkey: opkey,
        market: 'HKEX',
        symbol: symbol
      }
      return new Promise((resolve, reject) => {
        api.getStockPrice(params).then((res) => {
          resolve(res.data.Items)
        })
      })
    },
    // 获取股票详情的数据
    _getStockDetail (symbol) {
      let params = {
        opkey: opkey,
        market: 'HKEX',
        symbol: symbol
      }
      return new Promise((resolve, reject) => {
        api.getStockDetail(params).then((res) => {
          resolve(res.data.Items)
        })
      })
    },
    // 确定状态图标的 方法
    icon (val) {
      return val === 'TRADEIN' ? 'icon-buy' : val === 'TRADEOUT' ? 'icon-buysell' : 'icon-sell'
    },
    // 点击上下图标的方法
    iconClick (val, index) {
      this.currentIndex = index
      // this.itemObj = Object.assign({}, val)
      val.Invalid = !val.Invalid
      this._invalid(val)
    },
    _invalid (val) {
      if (val.Invalid) {
        this.items.forEach((item) => {
          item.Invalid = false
          if (item.Id === val.Id) item.Invalid = true
        })
      }
    },
    // 点击列表每一行的 方法
    listClick (val, index) {
      this.currentIndex = index
      val.Invalid = !val.Invalid
      this._invalid(val)
      // 获取股票详情的数据
      // this._getStockDetail(val.Symbol)
      // this.itemObj = Object.assign({}, val)
    },
    // 关闭整个 投资组合的方法
    closeClick () {
      this.$confirm('确定关闭投资组合界面吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.portfolioSection = false
        this.$message({
          type: 'success',
          message: '关闭成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 买入 按钮指令的 方法
    buyClick () {
      this.visible = true
    },
    // 获取股票最新报价的数据的方法
    portfolioListClick () {
      // 获取股票最新报价的数据
      this._getStockPrice(this.form.list).then((res) => {
        this.portfolioNewPriceList = res
      })
      // 调用定时器函数获取最新报价数据
      this._timeOut()
    },
    // 定时器封装函数
    _timeOut () {
      // 10 秒刷新界面
      // 计数的
      let count = 0
      const time = () => {
        this.timer = setTimeout(() => {
          // 获取股票最新报价的数据
          this._getStockPrice(this.form.list).then((res) => {
            this.portfolioNewPriceList = res
            count += 10
            if (count > 1000) {
              clearTimeout(self.timer)
              count = 0
              time()
            }
          })
          time()
        }, 10000)
      }
      time()
    },
    _commitManualTrade () {
      let params = {
        opkey: opkey,
        accountId: accountId,
        tradeType: 'BUY',
        manualtradeRequest: this.form
      }
      return new Promise((resolve, reject) => {
        api.commitManualTrade(params).then((res) => {
          resolve(res.data)
        })
      })
    },
    // 取消的方法
    cancel () {
      clearTimeout(this.timer)
      this.form = {
        id: null,
        list: null,
        Price: 0,
        Volume: 0,
        dayCount: 1,
        OrderType: '手动买入中',
        date: ''
      }
      this.portfolioNewPriceList = []
      this.visible = false
    },
    // 买入指令后，提交指令的方法
    onSubmit () {
      clearTimeout(this.timer)
      // post 请求提交买入股票的方法
      this._commitManualTrade().then((res) => {
        console.log(res)
      })
      this.buyListId++
      this.form = Object.assign({}, this.form, { id: this.buyListId })
      this.items.find(item => item.Symbol === this.form.list).buyList.push(this.form)
      this.form = {
        id: null,
        list: null,
        Price: 0,
        Volume: 0,
        dayCount: 1,
        OrderType: '',
        date: ''
      }
      this.portfolioNewPriceList = []
      this.visible = false
    },
    // 撤销 的方法
    cancelClick (item, value) {
      item.buyList = item.buyList.filter(t => t.id !== value.id)
    },
    // 手动刷新列表的方法
    refreshClick () {
      this.currentIndex = -1
      // 资金查询接口
      this._getAccountCapitalById().then((res) => {
        this.accountCapitalInfo = { ...res }
      })
      // 清空templete 数组
      this.items = []
      // 左右数据拼接的方法
      this._concatData()
    }
  },

  // 计算属性
  computed: {
  },

  // 监听
  watch: {
    // 监听路由变化
    '$route' (to, from) { },
    currentIndex (val, oldVal) {
      if (val !== oldVal) {
      }
    }
  },

  // 常用钩子函数，总共有8个，可以参照vue的生命周期看

  // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  created () {
    // 资金查询接口
    this._getAccountCapitalById().then((res) => {
      this.accountCapitalInfo = { ...res }
    })
    // 左右数据拼接的方法
    this._concatData()
  },
  // 完成挂载，相当于dom ready
  mounted () {
    let params = { opkey: opkey, authorizationcode: 'fdsal' }
    api.verifyUserAuthorizationCode(params).then((res) => {
      console.log(res)
    })
  },

  // 销毁，可以做一些定时器的销毁,缓存的清除等操作
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped='scoped'>
.activeBg {
  background: #15364c;
}
.icon-buy {
  background: url("../../assets/images/icon-buy.png") no-repeat center center;
}
.icon-buysell {
  background: url("../../assets/images/icon-buysell.png") no-repeat center
    center;
}
.icon-sell {
  background: url("../../assets/images/icon-sell.png") no-repeat center center;
}
.red {
  color: #ed1c24;
}
.green {
  color: #26ff00;
}
.portfolio {
  background: #000;
  min-width: 1200px;
  .portfolio-head {
    height: 40px;
    line-height: 40px;
    background: #1a1a1a;
    text-align: right;
    color: #fff;
  }
  .portfolio-section {
    color: #fff;
    height: 100%;
    background: #3e4949;
    padding: 10px;
    .section-left-title {
      display: flex;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }
    .section-left-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1a1a1a;
      padding: 5px;
      .tab-left {
        flex: 0 0 800px;
        display: flex;
        text-align: left;
        div {
          flex: 1;
          h5 {
            margin-bottom: 5px;
            color: #39fffa;
          }
        }
      }
      .tab-right {
        flex: 1;
        text-align: right;
        button {
          width: 80px;
          height: 26px;
          background: #506872;
          border-radius: 3px;
          &:hover {
            cursor: pointer;
            background: #235c5c;
          }
        }
      }
    }
    .section-left-list {
      .list-top {
        display: flex;
        border-bottom: 1px solid #999;
        padding: 0 10px;
        div:nth-child(1) {
          flex: 0 0 15%;
          text-align: left;
        }
        div:nth-child(2) {
          flex: 0 0 10%;
        }
        div {
          flex: 1;
          height: 40px;
          line-height: 40px;
          text-align: right;
        }
        div:last-child {
          flex: 0 0 30%;
          text-align: left;
          padding-left: 8%;
        }
      }
      .list-main {
        background: #1a1a1a;
        padding: 0 10px;
        li {
          border-bottom: 1px solid #333;
          .li-position {
            li {
              text-align: left;
              width: 100%;
              background: #00113f;
              span {
                display: inline-block;
                width: 17%;
                height: 20px;
                line-height: 20px;
                padding: 10px 0;
              }
              button {
                display: inline-block;
                text-align: center;
                width: 80px;
                height: 26px;
                line-height: 26px;
                color: #fff;
                flex: 0 0 20%;
                background: #00755f;
                border-radius: 3px;
                &:hover {
                  cursor: pointer;
                  background: #219696;
                }
              }
            }
          }
          div {
            display: flex;
            // border-bottom: 1px solid #333;
            padding: 2px 0;
            width: 100%;
            // position: relative;
            div:nth-child(1) {
              flex: 0 0 15%;
              text-align: left;
              display: flex;
              justify-content: space-between;
              // align-items: center;
              div {
                display: flex;
                flex-direction: column;
                flex: 1;
                span:nth-child(2) {
                  color: #39fffa;
                }
              }
              i {
                text-align: right;
                flex: 1;
                &:hover {
                  cursor: pointer;
                }
              }
            }
            div:nth-child(2) {
              flex: 0 0 10%;
            }
            div {
              flex: 1;
              // height: 50px;
              text-align: right;
              h5 {
                font-size: 16px;
                font-weight: normal;
              }
              // line-height: 25px;
              h5:nth-child(1) {
                margin-bottom: 2px;
              }
            }
            div:nth-child(2),
            div:nth-child(4),
            div:nth-child(7) {
              display: flex;
              flex-direction: column;
            }
            div:nth-child(3),
            div:nth-child(5),
            div:nth-child(6) {
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }
            div:nth-child(8) {
              flex: 0 0 30%;
              text-align: left;
              padding-left: 8%;
              display: flex;
              // justify-content: center;
              align-items: center;
              i {
                display: inline-block;
                width: 20px;
                height: 20px;
                padding-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
