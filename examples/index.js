/**
 * Hello ibird! :)
 * @type {App}
 */

const app = require('ibird').newApp();
const log = require('../index');

app.import(log);

app.play(() => {
    app.error('日志输出error...error');
    app.warn('日志输出warn...warn');
    app.info('日志输出info...info');
    app.verbose('日志输出verbose...verbose');
    app.debug('日志输出debug...debug');
    app.silly('日志输出silly...silly');
});