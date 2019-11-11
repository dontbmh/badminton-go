import * as sa from 'superagent';
import Response from '../model/Response';
import { serialize, deserialize } from './serializer';

export type ProgressChange = (percent: number) => void;
export type FormData = { fields?: object, files?: { [id: string]: Blob | File } };

class HttpClient {

    public token: string;
    private apiUrl: string;
    private timeout: number;
    private timeoutEx: number;

    constructor(config: any) {
        this.apiUrl = config.apiUrl;
        this.timeout = config.timeout;
        this.timeoutEx = config.timeoutEx;
    }

    buildUrl(url: string): string {
        return `${this.apiUrl}${url.indexOf('/') === 0 ? url : `/${url}`}`;
    }

    async request(req: sa.Request): Promise<sa.Response> {
        const res = await req.set('token', this.token);
        const token = res.header.token;
        if (token) { this.token = token; }
        return res;
    }

    async requestResolve<T>(req: sa.Request, klass: new () => T): Promise<Response<T>> {
        const resp = new Response<T>();
        try {
            const res = await this.request(req);
            const body = res.body;
            resp.status = body.status;
            resp.error = body.message;
            resp.data = deserialize<T>(body.data, klass);
        } catch (err) {
            const res = err.response;
            resp.status = res ? res.status : 0;
            resp.error = err.message;
            resp.data = null;
        }
        return resp;
    }

    post<T>(api: string, data: object, klass: new () => T): Promise<Response<T>> {
        const url = this.buildUrl(api);
        const req = sa.post(url)
            .send(serialize(data))
            .type('json')
            .timeout(this.timeout);
        return this.requestResolve(req, klass);
    }

    get<T>(api: string, klass: new () => T): Promise<Response<T>> {
        const url = this.buildUrl(api);
        const req = sa.get(url)
            .type('json')
            .timeout(this.timeout);
        return this.requestResolve(req, klass);
    }

    postForm<T>(api: string, data: FormData, klass: new () => T): Promise<Response<T>> {
        const url = this.buildUrl(api);
        const req = sa.post(url)
            .timeout(this.timeoutEx);
        for (const key of Object.keys(data.fields)) {
            req.field(key, data.fields[key]);
        }
        for (const key of Object.keys(data.files)) {
            req.attach(key, data.files[key]);
        }
        return this.requestResolve(req, klass);
    }

    download(url: string, change?: ProgressChange): Promise<Blob> {
        const req = sa.get(url)
            .responseType('blob')
            .timeout(this.timeoutEx)
            .on('progress', e => {
                if (change && e.direction === 'download') {
                    change(e.percent);
                }
            });
        return new Promise<Blob>(async (resolve) => {
            const res = await this.request(req);
            resolve(<Blob>res.body);
        });
    }
}

const http = new HttpClient({
    apiUrl: '.',
    timeout: 5 * 1000,
    timeoutEx: 300 * 1000
})

export default http;