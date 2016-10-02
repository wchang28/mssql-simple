"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sql = require('mssql');
var events = require('events');
var _ = require('lodash');
// will emit the following events
// 1. connected
// 2. error
// 3. disconnected
var SimpleMSSQL = (function (_super) {
    __extends(SimpleMSSQL, _super);
    function SimpleMSSQL(__sqlConfig, options) {
        _super.call(this);
        this.__sqlConfig = __sqlConfig;
        this.__connection = null;
        this.__options = _.assignIn({}, SimpleMSSQL.defaultOptions, (options ? options : {}));
    }
    Object.defineProperty(SimpleMSSQL.prototype, "options", {
        get: function () { return this.__options; },
        enumerable: true,
        configurable: true
    });
    SimpleMSSQL.prototype.onConnectionError = function (err) {
        var _this = this;
        try {
            this.__connection.close();
        }
        catch (e) { }
        this.__connection = null;
        if (this.options && typeof this.options.reconnectIntervalMS === 'number' && this.options.reconnectIntervalMS > 0) {
            setTimeout(function () {
                _this.connect();
            }, this.options.reconnectIntervalMS);
        }
        this.emit('error', err);
    };
    SimpleMSSQL.prototype.connect = function () {
        var _this = this;
        if (!this.__connection) {
            this.__connection = new sql.Connection(this.__sqlConfig, function (err) {
                if (err)
                    _this.onConnectionError(err);
                else
                    _this.emit('connected');
            });
            this.__connection.on('error', function (err) {
                _this.onConnectionError(err);
            });
        }
    };
    SimpleMSSQL.prototype.disconnect = function () {
        if (this.__connection) {
            try {
                this.__connection.close();
            }
            catch (e) { }
            this.__connection = null;
            this.emit('disconnected');
        }
    };
    SimpleMSSQL.prototype.query = function (sqlString, params, done) {
        if (!this.__connection) {
            done(SimpleMSSQL.NOT_CONNECTED, null);
            return;
        }
        var request = new sql.Request(this.__connection);
        request.multiple = true;
        if (params) {
            for (var field in params)
                request.input(field, params[field]);
        }
        request.query(sqlString, done);
    };
    SimpleMSSQL.prototype.execute = function (storedProc, params, done) {
        if (!this.__connection) {
            done(SimpleMSSQL.NOT_CONNECTED, null);
            return;
        }
        var request = new sql.Request(this.__connection);
        if (params) {
            for (var field in params)
                request.input(field, params[field]);
        }
        request.execute(storedProc, done);
    };
    SimpleMSSQL.defaultOptions = { reconnectIntervalMS: 3000 };
    SimpleMSSQL.NOT_CONNECTED = { error: 'db-not-connected', error_description: 'not connected to the database' };
    return SimpleMSSQL;
}(events.EventEmitter));
exports.SimpleMSSQL = SimpleMSSQL;
