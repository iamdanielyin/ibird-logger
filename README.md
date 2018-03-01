# ibird-logger

ibird的基础日志插件，使用[winston](https://www.npmjs.com/package/winston)作为底层日志引擎。

## 安装

```sh
npm install ibird-logger
```

## 引用

```js
const app = require('ibird').newApp();
const logger = require('ibird-logger');

app.import(logger);
```

## 插件信息

- **命名空间** - ibird-logger
- **引用参数**
  - `logDir` - 可选，字符串类型，日志存放目录
  - `transports` - 可选，数组类型，覆盖默认的`transports`
  - `exceptionHandlers` - 可选，数组类型，覆盖默认的`exceptionHandlers`
  - `formatter` - 可选，函数类型，日志输出格式化函数，传入`info`参数
  - `logOpts` - 可选，对象类型，覆盖默认的所有日志设置
- **API**
  - `info(msg)` - 同`winston.info`函数
  - `error(msg)` - 同`winston.error`函数
  - `warn(msg)` - 同`winston.warn`函数
  - `verbose(msg)` - 同`winston.verbose`函数
  - `debug(msg)` - 同`winston.debug`函数
  - `silly(msg)` - 同`winston.silly`函数


## 注意

插件初始化成功，日志对象会以`logger`为`key`更新到应用配置中，如有需要，可通过`app.c().logger`获取`winston`的日志对象。