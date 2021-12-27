const { makeJestConfig } = require('jest-simple-config');

const config = makeJestConfig({ testEnvironment: 'jsdom', collectCoverage: false });

module.exports = config;
