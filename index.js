/**
 * 日志模块
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
const enable = {
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
 */
function onLoad(app) {
    const config = app.c();
    const logDir = config.logDir || path.join(process.cwd(), 'logs');
    const logOpts = config.logOpts;
    if (logDir) {
        ensureLogDir(logDir);
    }
    const transports = [
        new winston.transports.Console({
            humanReadableUnhandledException: true,
            colorize: true,
            json: false
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            colorize: true,
            maxsize: 20971520, // 20M
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            colorize: true,
            maxsize: 52428800, // 50M
            maxFiles: 5
        })
    ];
    const exceptionHandlers = [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
            colorize: true,
            maxsize: 20971520, // 20M
            maxFiles: 5
        }),
    ];
    const opts = logOpts || {
        level: 'info',
        format: combine(
            label({ label: config.name || 'ibird' }),
            timestamp(),
            printf(info => `${new Date(info.timestamp).toLocaleString()} [${info.label}] ${info.level}: ${info.message}`)
        ),
        transports,
        exceptionHandlers
    };
    const logger = winston.createLogger(opts);
    app.config({ logger });
    Object.assign(enable, {
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
    onLoad,
    enable
};