import yargs from 'yargs';
import chalk from 'chalk';

import OssimoWorkspace from './workspace';
import { OssimoOrchestratorClient } from './orchestrator';
import logger from './util/logger';

const WORKING_DIR = process.cwd()

/**
 * The CLI action used to clean up any build or generated files leftover from
 * a previously run build action.
 */
function cleanAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Cleaning...")
    ossimoWorkspace.clean()
}

/**
 * The CLI action used to build an Ossimo project or component, defined within
 * the workspace.
 */
async function buildAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Building...")
    await ossimoWorkspace.build();
    logger.info("Finished build.")
}

/**
 * The CLI action used to deploy an Osismo project or component, defined within
 * the workspace.
 */
function deployAction() {
    logger.info("Parsing workspace...")
    const ossimoWorkspace = new OssimoWorkspace(WORKING_DIR);
    logger.info("Deploying...")
    ossimoWorkspace.deploy()
}

/**
 * The CLI action used to display the status of all active deployments.
 */
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