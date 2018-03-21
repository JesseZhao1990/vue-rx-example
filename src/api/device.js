import { get } from '../tools/network'

export default {

  /**
   * 根据店铺ID,集团ID，集团名称等查询设备信息，包含店铺信息和设备数量
   * @param {*} params
   */
  getTerminalDevicesWithShop (params) {
    return get('/api/device/list', params)
  }
}
