import { request as umiRequest } from '@umijs/max';

export async function request<T>(
  url: string,
  options: any = { method: 'GET' },
): Promise<T | undefined> {
  if (!options['throwError']) {
    try {
      const resp: any = await umiRequest(url, options);
      return resp.data;
    } catch (ex) {
      return undefined;
    }
  }
  const resp: any = await umiRequest(url, options);
  return resp.data;
}

export function convertPageData(result: any) {
  return {
    data: result?.list || [],
    total: result?.total || 0,
    success: true,
  };
}
export function convertPageDataForAvg(result: any) {
  // console.log("result", result);

  // console.log("result.data", result.data);
  // console.log("result.data.list", result.data.list);
  // console.log("result.data.total", result.data.total);
  // console.log("result.data.length", result.data.length);
  // 基于实际API响应结构调整返回值处理
  return {
    data: result || [],
    total: result?.length || 0,
    success: true,
  };
}
export function orderBy(sort: any) {
  if (!sort) return;
  const keys = Object.keys(sort);
  if (keys.length !== 1) return;
  return keys[0] + ' ' + sort[keys[0]];
}

export async function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}
