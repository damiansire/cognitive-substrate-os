/**
 * @cognitive-substrate/evals — the offline-first eval harness.
 *
 * Categories (capability / regression / behavioral / adversarial / long-horizon) and
 * metrics (pass@1, time-to-pass, cost-to-pass) follow the CHARTER's eval program.
 */
export * from './types';
export * from './runner';
export * from './report';
export { cases } from './cases';
