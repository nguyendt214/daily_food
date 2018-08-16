import consulFactory from 'consul'
import logger from './logger';
import os from 'os';
import uuid from 'uuid';

export default port => {
    const consul = consulFactory();
    const host = os.hostname();
    const consulId = `data-${host}-${port}-${uuid.v4()}`;
    const pid = process.pid;

    const details = {
        name: 'tdf-portal-ui',
        address: host,
        check: {
            ttl: '10s',
            deregister_critical_service_after: '1m'
        },
        port: port,
        id: consulId
    };

    logger.info(`PID: ${pid}, PORT: ${port}, ID: ${consulId}`);

    consul.agent.service.register(details, err => {
        if (err) {
            throw new Error(err);
        }

        logger.info('Registered with Consul');

        setInterval(() => {
            consul.agent.check.pass({id: `service:${consulId}`}, err => {
                if (err) {
                    throw new Error(err);
                }
            });
        }, 5 * 1000);

        const unregister = () => {
            logger.info('De-Registering...');
            consul.agent.service.deregister({id: consulId}, (err) => {
                logger.info('de-registered.', err);
                process.exit();
            });
        };

        process.on('SIGINT', unregister);
        process.on('SIGTERM', unregister);
    });
};