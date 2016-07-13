import * as sql from 'mssql';
import * as events from 'events';
export interface QueryCallback {
    (err: any, recordsets: any): void;
}
export declare class SimpleMSSQL extends events.EventEmitter {
    private __sqlConfig;
    private __reconnectIntervalMS;
    private __connection;
    private static NOT_CONNECTED;
    constructor(__sqlConfig: sql.Configuration, __reconnectIntervalMS: number);
    private onConnectionError(err);
    connect(): void;
    disconnect(): void;
    query(sqlString: string, params: any, done: QueryCallback): void;
    execute(storedProc: string, params: any, done: QueryCallback): void;
}
export { Configuration } from 'mssql';
