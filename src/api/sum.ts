import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetSumList = (data:any) :AxiosPromise => {
    return get('/sumtable/list',data)
    // if(data) {
    //     console.log('httpGetSumList by project and month') 
    //     return get('/api/sumList_project&month.json','') //mock
    // }else{
    //     console.log('httpGetSumList') 
    //     return get('/api/sumList.json','') //mock
    // }
   
}

export const httpPostSum = (data:object) :AxiosPromise => {
    return post('/sumtable/save', data)
    // console.log('httpPostSum data:',data)
    // return get('/api/postSuccessful.json', '')
}  