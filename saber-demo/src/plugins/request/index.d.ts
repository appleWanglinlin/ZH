import { AxiosStatic,AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'

interface IRequestOptions extends AxiosRequestConfig {
  /**
   * 是否使用 requestCache方法请求，默认`false`
   */
  useCache?: boolean;
  /**
   * 是否请求接口重新缓存数据，默认`false`。`useCache`为`true`时才生效
   */
  recache?: boolean;
}

interface fn {
  (options: IRequestOptions): Promise<AxiosResponse>
}

interface Request extends AxiosInstance {
  /**
   * 添加前缀 `/ams`
   */
  $ams: fn;
  /**
   * 添加前缀 `/ams-auth`
   */
  $auth: fn;
  /**
   * 添加前缀 `/pms`
   */
  $pms: fn;
  /**
   * 添加前缀 `/blade-supplier`
   */
  $pss: fn;
  /**
   * 添加前缀 `/sams`
   */
  $sams: fn;
  /**
   * 添加前缀 `/blade-system`
   */
  $system: fn;
  $opsResource: fn;
  /**
   * 添加前缀 `/blade-purchase`
   */
  $purchase: fn;
  /**
   * 添加前缀 `/oms`
   */
  $oms: fn;
  /**
   * 添加前缀 `/pps`
   */
  $pps: fn;
  /**
   * 添加前缀 `/tms-base`
   * 物流业务基础数据服务前缀、物流商基础信息、渠道基础信息
   */
  $tms_base: fn;
  /**
   * 添加前缀 `/tms-optimize`
   * 物流优选服务前缀、渠道限制、物流费规则、附加费等
   */
  $tms_optimize: fn;
  /**
   * 添加前缀 `/tms-trace`
   * 轨迹服务前缀、物流轨迹
   */
  $tms_trace: fn;
  /**
   * 添加前缀 `/tms-system`
   * 物流系统基础数据服务前缀、省市区、字典等
   */
  $tms_system: fn;
  /**
   * 添加前缀 `/tms-forecast`
   * 物流预报系统、预报面单等
   */
  $tms_forecast: fn;
  /**
   * 添加前缀 `/ims`
   * 库存管理系统
   */
  $ims: fn;
  /**
   * 添加前缀 `/ers`
   * 汇率管理系统
   */
  $ers: fn;
  /**
   * 添加前缀 `/lmsAliExpress`
   * 速卖通
   */
  //$lmsAliExpress:fn;
}


export default <Request> { }

export var axios: AxiosStatic


interface IHeaders {
  Authorization: string;
  [key: string]: any;
}
export function getAuthHeader(isToken = true): IHeaders;


interface IResData {
  code: 401 | 500 | 200 | number;
  success: boolean;
  msg: string;
  data: any;
}
interface IRequestCacheOptions extends AxiosRequestConfig {
  /**
   * 是否请求接口重新缓存数据，默认`false`
   */
  recache: boolean;
}
/**
 * 根据请求的 url、method、params、data 数据生成唯一key
 *
 * 请求返回的数据缓存到本地，下次请求时直接读取缓存
 */
export function requestCache(options: IRequestCacheOptions): Promise<IResData>


/**
 * 删除的key，key为空时则清空所有
 */
type TKey = string;

/**
 * 清空通过 requestCache 方法请求产生的缓存数据
 */
export function clearRequestCache(key?: TKey): void;
