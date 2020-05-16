// logger config level(trace, warn, error)
const logger_config = {
    appenders: {
        system: {
            type: 'datefile', 
            filename: './log/system.log', 
            pattern: '-yyyy-MM-dd',
            // add ecxtension(.log) after date
            keepFileExt: true, 
            //log file keeps 5 days
            daysToKeep: 5,
            // compress as ~.log.gz
            compress: true,
        }
    },
    categories: {
        default: {appenders: ['system'], level: 'error'},
    }
}
module.exports = logger_config;