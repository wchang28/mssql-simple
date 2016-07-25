import * as sql from 'mssql';
import * as events from 'events';
export interface QueryCallback {
    (err: any, recordsets: any): void;
}
export interface Options {
    reconnectIntervalMS?: number;
}
export declare class SimpleMSSQL extends events.EventEmitter {
    private __sqlConfig;
    private __connection;
    private __options;
    private static defaultOptions;
    private static NOT_CONNECTED;
    constructor(__sqlConfig: sql.Configuration, options: Options);
    options: Options;
    private onConnectionError(err);
    connect(): void;
    disconnect(): void;
    query(sqlString: string, params: any, done: QueryCallback): void;
    execute(storedProc: string, params: any, done: QueryCallback): void;
}
export { Configuration } from 'mssql';
