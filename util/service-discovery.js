import consulFactory from 'consul'
import logger from './logger';

const consul = consulFactory();

let SERVICES = {};

export default service => {
    let s = SERVICES[service];
    const promiseSupplier = observable => new Promise((resolve, reject) => {
        observable(data => {
            if (data.length == 0) {
                reject(new Error(`No IP resolved for service ${service}.`));
            } else {
                resolve(data);
            }
        });
    });

    if (s) {
        return promiseSupplier(cb => cb(s));
    } else {
        let watcher = consul.watch({
            method: consul.health.service,
            options: {
                service: service,
                passing: true
            }
        });

        return promiseSupplier(cb => {
            watcher.on('change', data => {
                logger.info(`Received discovery update for service ${service}. Nodes count: ${data.length}`);
                SERVICES[service] = data;
                cb(data);
            });
        });
    }
};