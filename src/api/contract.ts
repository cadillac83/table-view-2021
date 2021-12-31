import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetContractList = (data:any) :AxiosPromise => {
    return get('/contract/list', data)
    // console.log('httpGetContractList')
    // return get('/api/contractList.json','') //mock
}

export const httpGetContractNameList = () :AxiosPromise => {
    return get('/contract/listProjectName','')   
    // console.log('httpGetContractNameList') 
    // return get('/api/contractListProjectName.json','') //mock
}

export const httpPostContract = (data:Object) :AxiosPromise => {
    return post('/contract/save', data)
    // console.log('httpPostContract data:',data)
    // return get('/api/postSuccessful.json', '')
} 
export const httpGetDetailOfContractList = (data:any) :AxiosPromise => {
    return get('/contract/detail',data)
}