const yargs = require('yargs');
const path = require('path');
const net = require('net');

import { OssimoOrchestrator, Deployment } from './orchestrator';

const DEFAULT_PORT = 13131;

/**
 * The CLI action used to start the server running off of some port.
 */
function startAction() {
    const ossimoOrchestrator = new OssimoOrchestrator(DEFAULT_PORT, process.cwd());

    ossimoOrchestrator.start();
}

export function run() {
    const argv = yargs.command('start', 'Start the server', (yargs) => {
        startAction();
    })
    .help()
    .argv
}