type Method =
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'connect'
    | 'head'
    | 'options'
    | 'trace'
    | 'upload'
    | 'download'
    | 'abort';

// 请求相同配置
interface SameConfig {
    url?: string;
    method?: Method;
    params?: object;
    header?: {
        contentType?: string;
    };
    dataType?: string;
    responseType?: string;
}

// 普通请求配置数据
interface RequestConfig extends SameConfig {
    data?: object;
}

// 下载、上传相同配置
interface DownloadAndUploadSameConfig extends SameConfig {
    onProgressUpdate?(): void;
    onHeadersReceived?(): void;
    offProgressUpdate?(): void;
    offHeadersReceived?(): void;
}

// 下载请求配置数据
interface DownloadConfig extends DownloadAndUploadSameConfig {}

// 上传请求配置数据
interface uploadConfig extends DownloadAndUploadSameConfig {
    files?: Array<string>;
    fileType?: string;
    filePath: string;
    name: string;
    formData: object;
}

// 请求后的响应数据
interface RequestResData {
    data: object;
    header: object;
    statusCode: number;
    errMsg: string;
}

// 拦截器
interface Interceptor<V> {
    use(
        fulfilled?: (value: V) => V | false | Promise<any>,
        rejected?: (error: any) => any | false | Promise<any>
    ): number;
    eject(id: number): void;
}

// 实例
interface Instance {
    (config: RequestConfig);
    (url: string, config?: RequestConfig);
    interceptors: {
        global: {
            request: Interceptor<RequestConfig>;
            response: Interceptor<RequestResData>;
        };
        scoped: {
            request: Interceptor<RequestConfig>;
            response: Interceptor<RequestResData>;
        };
    };
    request(config: RequestConfig): Promise<any>;
    get(url: string, config?: RequestConfig): Promise<any>;
    post(url: string, config?: RequestConfig): Promise<any>;
    put(url: string, config?: RequestConfig): Promise<any>;
    delete(url: string, config?: RequestConfig): Promise<any>;
    connect(url: string, config?: RequestConfig): Promise<any>;
    head(url: string, config?: RequestConfig): Promise<any>;
    options(url: string, config?: RequestConfig): Promise<any>;
    trace(url: string, config?: RequestConfig): Promise<any>;
    download(url: string, config?: DownloadConfig): Promise<any>;
    upload(url: string, config: uploadConfig): Promise<any>;
    abort(): void;
}

declare function Request(): Instance;

export default Request;
