import { defineConfig, devices } from '@playwright/test';
import path, { dirname } from 'path';
import dotenv from 'dotenv'


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.ENV = process.env.ENV ?? 'dev';
const configFile = `./config-${process.env.ENV}.env`;
console.log('Config file: ' + configFile)
dotenv.config({path: path.resolve(__dirname, configFile)});


export default defineConfig({
  globalSetup: ['./global-setup'],
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['html', { open: 'always' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
