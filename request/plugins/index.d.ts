export type Method =
    | 'get' | 'GET'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'patch' | 'PATCH'
    | 'download' | 'DOWNLOAD'
    | 'upload' | 'UPLOAD'
    | 'abort' | 'ABORT'


// 请求相同配置
export interface SameConfig {
    url?: string,
    method?: Method,
    header?: any,
    params?: any,
}

// 普通请求配置数据
export interface RequestConfig extends SameConfig {
    data?: any
}

// 下载、上传相同配置
export interface DownloadAndUploadSameConfig extends SameConfig {
    onProgressUpdate?(): void,
    onHeadersReceived?(): void,
    offProgressUpdate?(): void,
    offHeadersReceived?(): void
}

// 下载请求配置数据
export interface DownloadConfig extends DownloadAndUploadSameConfig { }

// 上传请求配置数据
export interface uploadConfig extends DownloadAndUploadSameConfig {
    files?: Array<string>,
    fileType?: string,
    filePath: string,
    name: string,
    formData: any
}

// 拦截器
export interface Interceptor {
    use(fulfilled?, rejected?): number,
    eject(id: number): void;
}

// 实例
export interface Instance {
    (config: RequestConfig);
    (url: string, config?: RequestConfig);
    interceptors: {
        global: {
            request: Interceptor,
            response: Interceptor
        },
        scoped: {
            request: Interceptor,
            response: Interceptor
        },
    },
    request(config: RequestConfig): Promise<any>;
    get(url: string, config?: RequestConfig): Promise<any>
    post(url: string, config?: RequestConfig): Promise<any>
    put(url: string, config?: RequestConfig): Promise<any>
    delete(url: string, config?: RequestConfig): Promise<any>
    head(url: string, config?: RequestConfig): Promise<any>
    options(url: string, config?: RequestConfig): Promise<any>
    patch(url: string, config?: RequestConfig): Promise<any>
    download(url: string, config?: DownloadConfig): Promise<any>
    upload(url: string, config: uploadConfig): Promise<any>
    abort(): void
}

declare function Request(): Instance

export default Request