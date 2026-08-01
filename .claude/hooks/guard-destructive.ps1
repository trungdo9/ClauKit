# guard-destructive.ps1 — thin delegate to guard-destructive.cjs (single implementation).
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$input | node (Join-Path $scriptDir "guard-destructive.cjs")
exit $LASTEXITCODE
