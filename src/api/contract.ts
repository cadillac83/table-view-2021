import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const getContractList = () :AxiosPromise => {
    // return get('/contract/listProjectName','')
    return get('/api/contractList.json','') //mock
}

export const getContractNameList = () :AxiosPromise => {
    // return get('/contract/listProjectName','')    
    return get('/api/contractListProjectName.json','') //mock
}

export const postContract = (data:Object) :AxiosPromise => {
    return post('/contract/save', data)
}  