/**
 * 日志模块
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
const ctx = {};
const api = {
    error: null,
    warn: null,
    info: null,
    verbose: null,
    debug: null,
    silly: null
};

/**
 * 加载插件
 * @param app
 * @param options
 */
function onload(app, options) {
    ctx.app = app;
    ctx.options = options || {};

    const config = app.c();
    options.logDir = options.logDir || path.join(process.cwd(), 'logs');
    ensureLogDir(options.logDir);
    
    const transports = options.transports || [
        new winston.transports.Console({
            humanReadableUnhandledException: true,
            colorize: true,
            json: false
        }),
        new winston.transports.File({
            filename: path.join(options.logDir, 'error.log'),
            level: 'error',
            colorize: true,
            maxsize: 20971520, // 20M
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: path.join(options.logDir, 'combined.log'),
            colorize: true,
            maxsize: 52428800, // 50M
            maxFiles: 5
        })
    ];
    const exceptionHandlers = options.exceptionHandlers || [
        new winston.transports.File({
            filename: path.join(options.logDir, 'exceptions.log'),
            colorize: true,
            maxsize: 20971520, // 20M
            maxFiles: 5
        }),
    ];
    const formatter = (typeof options.formatter === 'function') ? options.formatter :
        info => `${new Date(info.timestamp).toLocaleString()} [${info.label}] ${info.level}: ${info.message}`;
    const opts = options.logOpts || {
        level: 'info',
        format: combine(
            label({ label: config.name || 'ibird' }),
            timestamp(),
            printf(formatter)
        ),
        transports,
        exceptionHandlers
    };
    const logger = winston.createLogger(opts);
    app.config({ logger });
    Object.assign(api, {
        error: logger.error.bind(logger),
        warn: logger.warn.bind(logger),
        info: logger.info.bind(logger),
        verbose: logger.verbose.bind(logger),
        debug: logger.debug.bind(logger),
        silly: logger.silly.bind(logger)
    });
}

/**
 * 确保日志目录存在
 * @param dir
 */
function ensureLogDir(dir) {
    if (!dir) return;
    let mkdir = true;
    try {
        const stat = fs.statSync(dir);
        if (stat && !stat.isDirectory()) {
            mkdir = false;
            throw new Error(`'logDir' must be a directory`);
        }
    } catch (e) {
        if (mkdir) {
            fs.mkdirSync(dir);
        }
    }
}

/**
 * 导出模块
 */
module.exports = {
    namespace: 'ibird-logger',
    onload,
    api
};