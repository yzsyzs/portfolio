import axios from './axios'
import qs from 'qs'
const BASEURL = 'http://172.28.2.13'
export default {
  // 投资组合查询
  getAccountPortfolioInfos: (req) => {
    return axios.get(`${BASEURL}/TradeSystem2_8_8_Test/InvestorService.svc/rest/GetAccountPortfolioInfos?` + qs.stringify(req))
  },
  // 资金查询
  getAccountCapitalById: (req) => {
    return axios.get(`${BASEURL}/TradeSystem2_8_8_Test/InvestorService.svc/rest/GetAccountCapitalById?` + qs.stringify(req))
  },
  // 获取每一只股票列表
  getStockList: (req) => {
    return axios.get(`${BASEURL}/TradeSystem2_8_8_Test/StockService.svc/rest/GetStockList?` + qs.stringify(req))
  },
  // 获取股票最新报价
  getStockPrice: (req) => {
    return axios.get(`${BASEURL}/TradeSystem2_8_8_Test/StockService.svc/rest/GetStockPrice?` + qs.stringify(req))
  },
  // 获取股票信息详情
  getStockDetail: req => {
    return axios.get(`${BASEURL}/TradeSystem2_8_8_Test/StockService.svc/rest/GetStockDetail?` + qs.stringify(req))
  }
}
