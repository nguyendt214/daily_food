import consulFactory from 'consul'
import logger from './logger';

const consul = consulFactory();

let CONFIG = null;

const options = { key: 'tdf-portal-ui/config.json' };

if (process.env.CONSUL_CONFIG_TOKEN) {
    options.token = process.env.CONSUL_CONFIG_TOKEN
}

const watch = consul.watch({ method: consul.kv.get, options: options });

CONFIG = new Promise((resolve, reject) => {
    watch.on('change', data => {
        try {
            const d = data ? JSON.parse(data.Value) : {};
            logger.info(`Updating configuration with: ${JSON.stringify(d)}`);
            resolve(d);
            CONFIG = new Promise(resolve => resolve(d));
        } catch (e) {
            reject(e);
        }
    });
});

watch.on('error', logger.error);

export default () => CONFIG;