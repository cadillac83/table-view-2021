import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetActAccPmtList = (data:any) :AxiosPromise => {
    // return get('/history/detail','')
    if(data) {
        return get('/api/actualAcceptPaymentList_project&month.json','') //mock
    }else{
        return get('/api/actualAcceptPaymentList.json','') //mock
    }
   
}

export const httpPostActAccPmt = (data:object) :AxiosPromise => {
    // return post('/history/save', data)
    console.log('httpPostActAccPmt data:',data)
    return get('/api/postSuccessful.json', '')
}  