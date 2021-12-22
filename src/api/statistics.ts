import { get, post } from '@/util/httpRequests'
import { AxiosPromise } from 'axios'

export const httpStatisticsOfContract = (data:any) :AxiosPromise => {
    return get('/statistics', data)
}
