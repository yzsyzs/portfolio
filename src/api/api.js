import axios from './axios'
import qs from 'qs'
export default {
  // 投资组合查询
  getAccountPortfolioInfos: (req) => {
    return axios.get('http://172.28.2.13/TradeSystem2_8_8_Test/InvestorService.svc/rest/GetAccountPortfolioInfos?' + qs.stringify(req))
  }
}
