#!/usr/bin/env node
import * as path from 'path';
import { runEvals } from './runner';
import { renderReportMarkdown, writeReport } from './report';
import { cases } from './cases';

/**
 * Runnable entrypoint (`npm run eval`). Runs every case, prints the markdown report,
 * writes `evals-report/` artifacts, and exits non-zero if any case failed (CI gate).
 */
async function main() {
    const report = await runEvals(cases);
    console.log(renderReportMarkdown(report));

    const outDir = path.resolve(process.cwd(), 'evals-report');
    const { md, json } = writeReport(report, outDir);
    console.log(`>>> Reporte escrito en:\n    ${md}\n    ${json}`);

    if (report.passed < report.total) {
        console.error(`>>> ${report.total - report.passed} eval(s) fallaron.`);
        process.exit(1);
    }
}

main().catch((e) => {
    console.error('>>> [Eval Fatal]:', e);
    process.exit(1);
});
