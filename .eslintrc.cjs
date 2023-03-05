module.exports = {
	env: {
		browser: true,
		es2021: true,
		"jest/globals": true,
	},
	extends: "eslint:recommended",
	plugins: ["jest"],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	rules: {},
};
