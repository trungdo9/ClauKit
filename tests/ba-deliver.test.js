import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

const repoRoot = path.resolve(import.meta.dirname, '..');
const demoProject = path.join(repoRoot, 'plans/ba/demo');

function setupProjectCopy(srcDir, projName) {
  const dst = path.join(os.tmpdir(), projName);
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true });
  fs.mkdirSync(path.join(dst, 'entities'), { recursive: true });
  for (const file of fs.readdirSync(path.join(srcDir, 'entities'))) {
    const content = fs.readFileSync(path.join(srcDir, 'entities', file), 'utf8');
    const updated = content.replace(/project: demo/g, `project: ${projName}`);
    fs.writeFileSync(path.join(dst, 'entities', file), updated);
  }
  return dst;
}

let projects = [];

test('the derived class renders byte-identically twice, the owned class refuses the second run', () => {
  const projectDir = setupProjectCopy(demoProject, 'test-proj-1');
  projects.push(projectDir);

  // Render scope twice
  execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} scope --force`, {
    cwd: repoRoot,
    stdio: 'pipe',
  });
  const scope1 = fs.readFileSync(path.join(projectDir, 'deliverables/SCOPE-001.md'), 'utf8');

  execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} scope`, {
    cwd: repoRoot,
    stdio: 'pipe',
  });
  const scope2 = fs.readFileSync(path.join(projectDir, 'deliverables/SCOPE-001.md'), 'utf8');

  assert.strictEqual(scope1, scope2, 'derived class scope should be byte-identical on second run');

  // Render uat once, check it succeeds
  const result1 = execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} uat --force 2>&1`, {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.ok(result1.includes('✓') || result1.includes('delivered'), 'first uat render should succeed');

  // Try to render uat again without --force, should fail
  try {
    execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} uat 2>&1`, {
      cwd: repoRoot,
      stdio: 'pipe',
    });
    assert.fail('second uat render without --force should exit 1');
  } catch (e) {
    assert.strictEqual(e.status, 1, 'second uat render without --force should exit 1');
    const result2 = e.stdout ? e.stdout.toString() : e.message;
    assert.ok(result2.includes('owned') || result2.includes('pass --force'), 'should mention owned class and --force');
  }

  // Render uat again with --force, should succeed
  const result3 = execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} uat --force 2>&1`, {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.ok(result3.includes('✓') || result3.includes('delivered'), 'uat with --force should succeed');
});

test('the uat record covers every TC exactly once and its coverage line matches findGaps', () => {
  const projectDir = setupProjectCopy(demoProject, 'test-proj-2');
  projects.push(projectDir);

  execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} uat --force`, {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  const uatFile = path.join(projectDir, 'deliverables/UAT-001.md');
  const content = fs.readFileSync(uatFile, 'utf8');

  // Extract all TC ids from the file
  const tcMatches = content.match(/\bTC-\d{3}\b/g) || [];
  const uniqueTCs = [...new Set(tcMatches)];

  // Count TC occurrences — each should appear exactly once in the test table
  for (const tcId of uniqueTCs) {
    const regex = new RegExp(`\\|\\s*${tcId}\\s*\\|`, 'g');
    const matches = content.match(regex) || [];
    assert.strictEqual(matches.length, 1, `TC ${tcId} should appear exactly once in the table`);
  }

  // Verify coverage line equals gap output
  const gapOutput = JSON.parse(
    execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} gap ${projectDir} --json`, {
      cwd: repoRoot,
      encoding: 'utf8',
    })
  );

  const coverageMatch = content.match(/\*\*Độ phủ:\*\*.*?orphans=(\d+).*?unsourced=(\d+)/);
  assert.ok(coverageMatch, 'coverage line should be present');
  const fileOrphans = parseInt(coverageMatch[1], 10);
  const fileUnsourced = parseInt(coverageMatch[2], 10);
  assert.strictEqual(fileOrphans, gapOutput.orphans.length, 'orphan count should match gap output');
  assert.strictEqual(fileUnsourced, gapOutput.unsourced.length, 'unsourced count should match gap output');
});

test('the variance section lists exactly the approved CRs', () => {
  const projectDir = setupProjectCopy(demoProject, 'test-proj-3');
  projects.push(projectDir);

  execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} acceptance --force`, {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  const acceptanceFile = path.join(projectDir, 'deliverables/ACCEPTANCE-001.md');
  const content = fs.readFileSync(acceptanceFile, 'utf8');

  // Extract CRs from the changelog
  const changelogOutput = JSON.parse(
    execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} changelog ${projectDir} --json`, {
      cwd: repoRoot,
      encoding: 'utf8',
    })
  );

  const approvedCRs = changelogOutput.filter((cr) => cr.status === 'approved').map((cr) => cr.id);
  const rejectedCRs = changelogOutput.filter((cr) => cr.status === 'rejected').map((cr) => cr.id);

  // Verify all approved CRs are in the variance section
  for (const crId of approvedCRs) {
    assert.ok(content.includes(crId), `Approved CR ${crId} should be in variance section`);
  }

  // Verify no rejected CRs are in the variance section
  for (const crId of rejectedCRs) {
    const varianceSection = content.match(/## Thay đổi[\s\S]*?(?=##|$)/)?.[0] || '';
    assert.ok(!varianceSection.includes(crId), `Rejected CR ${crId} should NOT be in variance section`);
  }
});

test('no deliverable carries a timestamp, and every one declares its class', () => {
  const projectDir = setupProjectCopy(demoProject, 'test-proj-4');
  projects.push(projectDir);

  // Render all six
  const actions = ['scope', 'release-notes', 'uat', 'acceptance', 'golive', 'handover'];
  for (const action of actions) {
    execSync(`node ${path.join(repoRoot, '.claude/scripts/ba/traceability.cjs')} deliver ${projectDir} ${action} --force`, {
      cwd: repoRoot,
      stdio: 'pipe',
    });
  }

  const deliverableDir = path.join(projectDir, 'deliverables');
  const files = fs.readdirSync(deliverableDir).filter((f) => f.endsWith('.md') && f !== 'PRD-001.md' && f !== 'SRS-001.md');

  // Check no timestamps
  let timestampCount = 0;
  for (const file of files) {
    const content = fs.readFileSync(path.join(deliverableDir, file), 'utf8');
    const isoPat = /\d{4}-\d{2}-\d{2}T|\bGenerated at\b|\bSinh lúc\b/g;
    const matches = content.match(isoPat) || [];
    timestampCount += matches.length;
  }
  assert.strictEqual(timestampCount, 0, 'no deliverable should carry ISO-8601 timestamps or generation timestamps');

  // Check class declarations
  const classPattern = /<!--\s*ba-deliverable:\s*[^·]*·\s*class:\s*(derived|owned)\s*·/;
  const expectedClasses = {
    'SCOPE-001.md': 'derived',
    'RELEASE-NOTES-001.md': 'derived',
    'UAT-001.md': 'owned',
    'ACCEPTANCE-001.md': 'owned',
    'GOLIVE-001.md': 'owned',
    'HANDOVER-001.md': 'owned',
  };

  for (const file of Object.keys(expectedClasses)) {
    const filePath = path.join(deliverableDir, file);
    assert.ok(fs.existsSync(filePath), `File ${file} should exist`);
    const content = fs.readFileSync(filePath, 'utf8');
    const classMatch = content.match(classPattern);
    assert.ok(classMatch, `${file} should declare its class in header`);
    assert.strictEqual(classMatch[1], expectedClasses[file], `${file} should have class ${expectedClasses[file]}`);
  }

  // Cleanup
  for (const proj of projects) {
    if (fs.existsSync(proj)) fs.rmSync(proj, { recursive: true });
  }
});
