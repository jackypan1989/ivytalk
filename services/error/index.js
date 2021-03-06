var config = require('./config');

function getUnknownError (err) {
	return {
		err_code: 'UNKNOWN_ERR',
		err_description: config.UNKNOWN_ERR,
		err_raw: err || null
	};
}

module.exports = function (_err_code, _err) {
	var err_code = 'UNKNOWN_ERR',
		err = null,
		error,
		err_resp;

	if (typeof _err_code === 'string') {
		err_code = _err_code;
		err = _err || null;
	} else {
		err = _err_code;
	}

	error = config[err_code];
	if (!error || err_code === 'UNKNOWN_ERROR') {
		err_resp = getUnknownError(err);
	} else {
		err_resp = {
			err_code: err_code,
			err_description: error.message,
			err_raw: err
		};
	}

	err_resp.event = 'error';
	return err_resp;
};