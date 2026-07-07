Import-Module WebAdministration

$siteName = "mikroktic-manager"
$physicalPath = (Resolve-Path "$PSScriptRoot").Path
$port = 2026

if (-not (Test-Path "IIS:\Sites\$siteName")) {
  New-Website -Name $siteName -PhysicalPath $physicalPath -Port $port -HostHeader "" -Force
} else {
  Set-ItemProperty "IIS:\Sites\$siteName" -Name physicalPath -Value $physicalPath
}

$existingBinding = Get-WebBinding -Name $siteName -Protocol "https" -ErrorAction SilentlyContinue | Where-Object {
  $_.bindingInformation -like "*:$port:*"
}

if (-not $existingBinding) {
  New-WebBinding -Name $siteName -Protocol "https" -Port $port -IPAddress "*"
}

Write-Output "IIS site '$siteName' is configured for HTTPS port $port. Bind an SSL certificate in IIS Manager if one is not already assigned."
