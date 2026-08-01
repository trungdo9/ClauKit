# scout-block.ps1 — thin delegate to scout-block.cjs (the single implementation).
# Kept so PowerShell-wired setups keep working; logic lives in ONE place to
# prevent the substring-matching drift that caused false positives (G6).
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$input | node (Join-Path $scriptDir "scout-block.cjs")
exit $LASTEXITCODE
