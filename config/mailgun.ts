import keys = require('./secrets/mailgun.json');

const { apiKey, publicKey } = keys as any;

const developmentSettings = {
	domain: 'sandboxee77732dae204720b35b93c18fcff294.mailgun.org',
	from: 'Wedding Test <sandboxee77732dae204720b35b93c18fcff294@mailgun.org>',
	publicKey,
	apiKey,
};

const productionSettings = {
	domain: 'thebrownes.info',
	from: 'Daryl and Yasmin <y-amd-d@thebrownes.info>',
	publicKey,
	apiKey,
};

export default {
	...(process.env.NODE_ENV === 'production' ? productionSettings : developmentSettings),
};
