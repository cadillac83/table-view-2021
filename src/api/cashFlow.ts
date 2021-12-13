import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetCashOfContractList = (data:any) :AxiosPromise => {
  return get('/cashflow/cashOfContract',data)
  // console.log('httpGetCashOfContractList id is',id)
  // return get('/api/cashflowCashOfContract.json',id) // mock
}

export const httpPostCashflow = (data:Object) :AxiosPromise => {
    return post('/cashflow/save', data)
    // console.log('httpPostCashflow data:',data)
    // return get('/api/postSuccessful.json', '')
}  