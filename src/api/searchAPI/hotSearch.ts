import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'

const REQUEST_URL = {
  default: '/search/default',
  search: '/cloudsearch',
  hotDetail: '/search/hot/detail',
}

export const convertHotSearchDetail = async (res: AxiosResponse<any>): Promise<HotSearch[]> => {
  const data = res.data.data
  return data.map((item: any) => {
    return {
      searchWord: item.searchWord,
      score: item.score,
      content: item.content,
      iconType: item.iconType,
      iconUrl: item.iconUrl,
    }
  })
}

export const getHotSearchDetail = (params = {}) => {
  return getRequest(REQUEST_URL.hotDetail, params).then(convertHotSearchDetail)
}
