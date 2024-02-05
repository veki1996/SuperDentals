const bcrypt = require('bcryptjs');

export const isValidEmail = (email) => {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email,
	);
};

export const hashPass = async (unHash) => {
	return bcrypt.hash(unHash, 10).then(function (hash) {
		return hash;
	});
};

export const isSameHash = async (unHashPass, hashPass) => {
	return bcrypt.compare(unHashPass, hashPass).then(function (result) {
		return result;
	});
};
export const checkUppercase = (str) => {
	for (let i = 0; i < str?.length; i++) {
		if (str?.charAt(i) == str?.charAt(i).toUpperCase() && str?.charAt(i).match(/[a-z]/i)) {
			return true;
		}
	}
	return false;
};

export const checkLowerCase = (str) => {
	for (let i = 0; i < str?.length; i++) {
		if (str?.charAt(i) == str?.charAt(i).toLowerCase() && str?.charAt(i).match(/[a-z]/i)) {
			return true;
		}
	}
	return false;
};

export const hasNumber = (myString) => {
	return /\d/.test(myString);
};

export const containsSpecialChars = (str) => {
	const specialChars = /[!@#$%^&*]/;
	return specialChars.test(str);
};

export const atLeastEightChars = (str) => {
	const atLeas = /^(?=.*\d).{8,}$/;
	return atLeas.test(str);
};

export const handleCurrencies = (clinic) => {
	return clinic?.location.country === 'rs' ? 'RSD' : clinic?.location.country === 'ba' ? 'BAM' : 'EUR';
};

export const groupDataByDate = (dataset) => {
	const groupByDate = dataset.reduce((groups, data) => {
		const date = new Date(data.createdAt).toLocaleDateString('de-DE');
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(data?.views);
		return groups;
	}, {});

	const filteredArray = Object.keys(groupByDate).map((date) => {
		return {
			date: date,
			arrays: groupByDate[date],
		};
	});

	return filteredArray;
};

export const filterNumberInput = (e) => {
	if (e.code === 'Minus') {
		e.preventDefault();
	}
};

export const randomString = (length = 12, string = '') => {
	string += Math.random().toString(20).slice(2, length);
	if (string.length > length) return string.slice(0, length);
	return randomString(length, string);
};

export const getServiceName = (service, locale, fallback) => {
	const filteredService = service?.name?.find((names) => names?.country === locale);
	const fallbackService = service?.name?.find((names) => names?.country === 'gb');
	if (filteredService?.name === '' && fallback) {
		return fallbackService?.name?.trim();
	}
	return filteredService?.name?.trim();
};

export const getServiceDescription = (service, locale, fallback) => {
	const filteredService = service?.description?.find((descriptions) => descriptions?.country === locale);
	const fallbackService = service?.description?.find((descriptions) => descriptions?.country === 'gb');
	if (filteredService?.description === '' && fallback) {
		return fallbackService?.description?.trim();
	}
	return filteredService?.description?.trim();
};

export const getClinicDescription = (description, locale) => {
	const filteredDescription = description?.find((descriptions) => descriptions?.country === locale);
	return filteredDescription?.description?.trim();
};

export const getFAQ = (faq, locale, type, fallback) => {
	const filteredFAQ = faq.find((faqs) => faqs?.country === locale);
	const fallbackFAQ = faq.find((faqs) => faqs?.country === 'gb');

	if (type === 'question') {
		if (filteredFAQ?.question === '' && fallback) {
			return fallbackFAQ?.question?.trim();
		}
		return filteredFAQ?.question?.trim();
	}

	if (type === 'answer') {
		if (filteredFAQ?.answer === '' && fallback) {
			return fallbackFAQ?.answer?.trim();
		}
		return filteredFAQ?.answer?.trim();
	}
};

export const getLexicon = (lexicon, locale, type, fallback) => {
	const filteredLexicon = lexicon.find((el) => el?.country === locale);
	const fallbackLexicon = lexicon.find((el) => el?.country === 'gb');

	if (type === 'heading') {
		if (filteredLexicon?.heading === '' && fallback) {
			return fallbackLexicon?.heading?.trim();
		}
		return filteredLexicon?.heading?.trim();
	}

	if (type === 'description') {
		if (filteredLexicon?.description === '' && fallback) {
			return fallbackLexicon?.description?.trim();
		}
		return filteredLexicon?.description?.trim();
	}

	if (type === 'position') {
		if (filteredLexicon?.position === '' && fallback) {
			return fallbackLexicon?.position?.trim();
		}
		return filteredLexicon?.position?.trim();
	}
};
