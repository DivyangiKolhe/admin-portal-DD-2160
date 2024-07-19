const envs = {
    DEV: 'dev',
    TEST: 'test',
    PROD: 'prod'
}

const baseUrls = {
    [envs.DEV]: {
        dementiaApi: 'https://apidev.manastik.com/api',
    },
    [envs.TEST]: {
        dementiaApi: 'https://apitest.manastik.com/api',
    },
    [envs.PROD]: {
        dementiaApi: 'https://manastik.com/api',
    },
};

const ENV = Object.keys(envs).includes(process.env.NODE_ENV) ? process.env.NODE_ENV : [envs.TEST] || [envs.TEST];

export default {
    ENV,
    ...baseUrls[ENV]
}