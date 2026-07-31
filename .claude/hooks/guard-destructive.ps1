# guard-destructive.ps1 — thin delegate to guard-destructive.js (single implementation).
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$input | node (Join-Path $scriptDir "guard-destructive.js")
exit $LASTEXITCODE
