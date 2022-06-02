import type { AxiosResponse } from 'axios'
import { getRequest } from './request'
import { formatDate, getCompressedImgUrl } from '@/utils/common'

const REQUEST_URL = {
  songlist: '/personalized',
  mv: '/personalized/mv',
  newsong: '/personalized/newsong',
}