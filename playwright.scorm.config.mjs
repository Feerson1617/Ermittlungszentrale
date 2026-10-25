import {defineConfig,devices} from '@playwright/test';
import original from './playwright.config.mjs';
const webkit=[{name:'webkit-ipad',use:{...devices['iPad (gen 7) landscape'],browserName:'webkit'}},{name:'webkit-ipad-portrait',use:{...devices['iPad (gen 7)'],browserName:'webkit'}}];
export default defineConfig({
 ...original,
 testDir:'./tests',
 testMatch: /(?:browser|scorm)\/.*\.spec\.mjs$/,
 outputDir:'artifacts/scorm/browser-results',
 reporter:[['list'],['json',{outputFile:'artifacts/scorm/browser-results.json'}],['html',{outputFolder:'artifacts/scorm/browser-report',open:'never'}]],
 webServer:{command:'node scripts/serve-scorm.mjs',url:'http://127.0.0.1:4173/',reuseExistingServer:false},
 projects:[...original.projects.filter(p=>!p.name.startsWith('webkit')), ...webkit],
});
