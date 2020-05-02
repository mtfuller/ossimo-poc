const yargs = require('yargs');
const chalk = require('chalk');

const logger = require('./util/logger');
import OssimoWorkspace from './workspace';
import { OssimoOrchestratorClient } from './orchestrator';

const WORKING_DIR = process.cwd()

function cleanAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Cleaning...")
    ossimoWorkspace.clean()
}

function buildAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Building...")
    ossimoWorkspace.build()
}

function deployAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Deploying...")
    ossimoWorkspace.deploy()
}

async function statusAction() {
    const ossimoOrchestratorClient = new OssimoOrchestratorClient(13131);
    const statusInfo = await ossimoOrchestratorClient.getStatus();
    logger.info(statusInfo);
}

export function cli() {
    const argv = yargs.command('build', 'Build the current component or project', (yargs) => {
        buildAction();
    })
    .command('clean', 'Clean the current component or project', (yargs) => {
        cleanAction();
    })
    .command('deploy', 'Deploy the current component or project', (yargs) => {
        deployAction();
    })
    .command('status', 'Display the status of all deployed services', (yargs) => {
        statusAction();
    })
    .help()
    .argv
}