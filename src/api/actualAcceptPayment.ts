import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpGetActualAcceptPaymentList = () :AxiosPromise => {
    // return get('/history/detail','')
    return get('/api/acceptPaymentList.json','') //mock
}

export const httpPostActualAcceptPayment = (data:Object) :AxiosPromise => {
    // return post('/history/save', data)
    console.log('httpPostActualAcceptPayment data:',data)
    return get('/api/postSuccessful.json', '')
}  