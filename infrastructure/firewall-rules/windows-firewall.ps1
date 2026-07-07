New-NetFirewallRule -DisplayName "mikroktic-manager IIS HTTPS 2026" -Direction Inbound -Protocol TCP -LocalPort 2026 -Action Allow
New-NetFirewallRule -DisplayName "mikroktic-manager Web Local" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "mikroktic-manager API Local" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow -Profile Private
