import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetCashOfContractList = (id:string) :AxiosPromise => {
  return get('/cashflow/cashOfContract',id)
  // console.log('httpGetCashOfContractList id is',id)
  // return get('/api/cashflowCashOfContract.json',id) // mock
}

export const httpPostCashflow = (data:Object) :AxiosPromise => {
    return post('/cashflow/save', data)
    // console.log('httpPostCashflow data:',data)
    // return get('/api/postSuccessful.json', '')
}  