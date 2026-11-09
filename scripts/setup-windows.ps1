# Safe bootstrap helper: run without -Install to preview; -Install explicitly opts into winget commands.
# Does not install a paid service, Codex plugin, MCP provider, API key or Tripo integration.
[CmdletBinding()]
param([switch]$Install)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
Set-Location $root
Write-Host 'TIMBERLINE development setup — safe/manual-first' -ForegroundColor Cyan
if(-not $Install){
  Write-Host 'Dry-run only. To install free required CLI tools explicitly: .\scripts\setup-windows.ps1 -Install'
  Write-Host 'winget install --id OpenJS.NodeJS.LTS -e'
  Write-Host 'winget install --id Git.Git -e'
  Write-Host 'For Blender/Codex, follow official installers and verify license/account before setup.'
} else {
  if(-not (Get-Command winget -ErrorAction SilentlyContinue)){throw 'winget not found. Install tools manually.'}
  $confirmation=Read-Host 'Install Node.js LTS and Git via winget? Type YES to continue'
  if($confirmation -ne 'YES'){Write-Host 'Cancelled'; exit 0}
  & winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
  if($LASTEXITCODE -ne 0){throw 'Node.js installer returned an error'}
  & winget install --id Git.Git --exact --accept-package-agreements --accept-source-agreements
  if($LASTEXITCODE -ne 0){throw 'Git installer returned an error'}
  Write-Host 'Open a new terminal to refresh PATH.'
}
Write-Host 'Environment check:'
& (Join-Path $PSScriptRoot 'check-env.ps1')
if(Get-Command npm -ErrorAction SilentlyContinue){& npm run verify}
Write-Host 'To start: npm start; browse http://localhost:8797'
