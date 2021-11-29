import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const getCashOfContractList = () :AxiosPromise => {
  // return get('/cashflow/cashOfContract','')
  return get('/api/cashflowCashOfContract.json','') // mock
}

export const postCashflow = (data:Object) :AxiosPromise => {
    return post('/cashflow/save', data)
}  