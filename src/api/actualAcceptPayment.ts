import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetActAccPmtList = (data:any) :AxiosPromise => {
    return get('/history/list',data)
    // if(data) {
    //     console.log('httpGetActAccPmtList by project and month') 
    //     return get('/api/actualAcceptPaymentList_project&month.json','') //mock
    // }else{
    //     console.log('httpGetActAccPmtList') 
    //     return get('/api/actualAcceptPaymentList.json','') //mock
    // }
   
}
export const httpGetActAccPmtDetail = (data:any) :AxiosPromise => {
    return get('/history/detail',data)
    // if(data) {
    //     console.log('httpGetActAccPmtList by project and month') 
    //     return get('/api/actualAcceptPaymentList_project&month.json','') //mock
    // }else{
    //     console.log('httpGetActAccPmtList') 
    //     return get('/api/actualAcceptPaymentList.json','') //mock
    // }
   
}
export const httpGetDetailOfContractList = (data:any) :AxiosPromise => {
    return get('/contract/detail',data)
}
export const httpPostActAccPmt = (data:object) :AxiosPromise => {
    return post('/history/save', data)
    // console.log('httpPostActAccPmt data:',data)
    // return get('/api/postSuccessful.json', '')
}  