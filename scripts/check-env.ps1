# TIMBERLINE local readiness check, Windows PowerShell 5.1+ / PowerShell 7+.
# Read-only. Does not install tools, authenticate users, call APIs or spend credits.
[CmdletBinding()]
param(
  [switch]$ShowMcp,
  [string]$JsonReport = ''
)
$ErrorActionPreference = 'Continue'
$checks = New-Object System.Collections.Generic.List[object]
function Add-Check([string]$Name,[string]$Status,[string]$Detail,[bool]$Required=$false) {
  $checks.Add([pscustomobject]@{ name=$Name; status=$Status; detail=$Detail; required=$Required })
  $color = switch ($Status) { 'OK' {'Green'} 'WARN' {'Yellow'} 'MISSING' {'Red'} default {'Gray'} }
  Write-Host ("[{0}] {1}: {2}" -f $Status, $Name, $Detail) -ForegroundColor $color
}
function Get-Exec([string]$Name) {
  $c = Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $c) { return $null }
  $src = if ($c.Source) { $c.Source } else { $c.Path }
  if ($src -and $src -match '\\Microsoft\\WindowsApps\\(python|python3)\.exe$') { return $null }
  return $c
}
function Invoke-Quiet([string]$Command, [string[]]$Argv) {
  try { return ((& $Command @Argv 2>&1 | Out-String).Trim()) } catch { return ('error: ' + $_.Exception.Message) }
}
function Test-Command([string]$Name, [string]$Friendly, [bool]$Required, [string[]]$Argv) {
  $cmd = Get-Exec $Name
  if (-not $cmd) { Add-Check $Friendly ($(if($Required){'MISSING'}else{'WARN'})) "Not found on PATH" $Required; return $false }
  $line = (Invoke-Quiet $cmd.Source $Argv) -split '\r?\n' | Select-Object -First 1
  Add-Check $Friendly 'OK' ("{0} ({1})" -f $line, $cmd.Source) $Required
  return $true
}
Write-Host "`nTIMBERLINE local readiness — read-only checks`n" -ForegroundColor Cyan
Add-Check 'Operating system' 'OK' ([Environment]::OSVersion.VersionString)
Add-Check 'PowerShell' 'OK' ($PSVersionTable.PSVersion.ToString())
$node = Test-Command 'node' 'Node.js (>=20)' $true @('--version')
if($node){
  $ver = Invoke-Quiet 'node' @('--version')
  if($ver -match '^v(\d+)\.' -and [int]$Matches[1] -lt 20){Add-Check 'Node.js version gate' 'MISSING' "Node 20+ required; detected $ver" $true}
}
$null = Test-Command 'npm' 'npm' $true @('--version')
$null = Test-Command 'git' 'Git CLI' $true @('--version')
$null = Test-Command 'blender' 'Blender (recommended)' $false @('--version')
$null = Test-Command 'codex' 'Codex CLI (optional)' $false @('--version')
$null = Test-Command 'gh' 'GitHub CLI (recommended)' $false @('--version')
$null = Test-Command 'python' 'Python (optional texture generator)' $false @('--version')
$null = Test-Command 'uv' 'uv (optional Python manager)' $false @('--version')
$null = Test-Command 'nvidia-smi' 'NVIDIA GPU tools (optional)' $false @('--version')
$null = Test-Command 'winget' 'winget (optional installer)' $false @('--version')
$chrome = Get-Exec 'chrome'; if (-not $chrome) { $chrome = Get-Exec 'msedge' }
if ($chrome) {Add-Check 'Chromium-based browser' 'OK' $chrome.Source} else {Add-Check 'Browser' 'WARN' 'Check Chrome/Edge manually; WebGPU may require compatible driver'}
if ($IsWindows -or $env:OS -eq 'Windows_NT') {
  try {
    $gpus = @(Get-CimInstance Win32_VideoController -ErrorAction Stop | ForEach-Object { $_.Name })
    if($gpus.Count -gt 0){ Add-Check 'Display GPUs' 'OK' ($gpus -join ', ') } else { Add-Check 'Display GPUs' 'WARN' 'No GPU returned from WMI' }
  } catch { Add-Check 'Display GPUs' 'WARN' 'WMI query unavailable' }
}
$gh=Get-Exec 'gh'
if($gh){
  $login = Invoke-Quiet 'gh' @('api','user','--jq','.login')
  if($LASTEXITCODE -eq 0){
    if($login -eq 'AlexanderSeel'){Add-Check 'Personal GitHub authorization' 'OK' $login}
    else {Add-Check 'Personal GitHub authorization' 'WARN' "Authenticated as $login — do not push until personal account is active"}
  }else{Add-Check 'GitHub authorization' 'WARN' 'gh auth login required (personal account)'}
}
$identity = Invoke-Quiet 'git' @('config','--get','user.email')
if($identity){Add-Check 'Git commit identity' 'WARN' "Verify this is your personal identity: $identity"}
if($ShowMcp -and (Get-Exec 'codex')) {
  Write-Host "`nMCP tool registration (do not assume tools are installed):" -ForegroundColor Cyan
  $mcp = Invoke-Quiet 'codex' @('mcp','list')
  Write-Host $mcp
  Add-Check 'Codex MCP registry' 'OK' 'List shown above; inspect authentication and tool scopes separately'
}
if ($env:TRIPO_API_KEY) {Add-Check 'Tripo API key' 'WARN' 'Present (value hidden). API billing is distinct from Studio credits.'}
else {Add-Check 'Tripo API key' 'WARN' 'Not configured (not needed for manual Studio use). Studio and API balances differ.'}
if ($env:OPENAI_API_KEY) { Add-Check 'OpenAI API key' 'WARN' 'Present (value hidden); paid API usage requires approval.' }
else { Add-Check 'OpenAI API key' 'WARN' 'Not configured; ChatGPT Plus does not imply API access.' }
$root = Split-Path -Parent $PSScriptRoot
if(Test-Path (Join-Path $root 'package.json')){Add-Check 'Repository root' 'OK' $root $true}
if($JsonReport){
  $target = [System.IO.Path]::GetFullPath($JsonReport)
  $parent=Split-Path -Parent $target
  if(-not (Test-Path $parent)){ New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  $checks | ConvertTo-Json -Depth 3 | Set-Content -Path $target -Encoding UTF8
  Write-Host "Report saved at $target. Review it before sharing." -ForegroundColor Cyan
}
$failures = @($checks | Where-Object { $_.required -and $_.status -eq 'MISSING' }).Count
Write-Host "`nRequired missing: $failures. Optional WARNs do not block the demo." -ForegroundColor Cyan
if($failures -gt 0){exit 1}else{exit 0}
