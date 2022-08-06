import type { AxiosResponse } from 'axios'
import { getRequest } from '../request'

const REQUEST_URL = {
  detail: '/banner',
}

export const convertBanner = async (res: AxiosResponse<any>): Promise<Banner[]> => {
  const banners = res.data.banners
  return banners.map((item: { imageUrl: any; targetType: any; targetId: any }) => {
    return {
      imageUrl: item.imageUrl,
      targetType: item.targetType,
      targetId: item.targetId,
    }
  })
}

export const getBanner = (params = { type: 0 }) => {
  return getRequest(REQUEST_URL.detail, params).then(convertBanner)
}
