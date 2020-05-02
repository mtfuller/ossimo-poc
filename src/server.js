const yargs = require('yargs');
const net = require('net');

import { OssimoOrchestrator, Deployment } from './orchestrator';

const DEFAULT_PORT = 13131;

function startAction() {
    const ossimoOrchestrator = new OssimoOrchestrator(DEFAULT_PORT);

    ossimoOrchestrator.start();
}

export function run() {
    const argv = yargs.command('start', 'Start the server', (yargs) => {
        startAction();
    })
    .help()
    .argv
}