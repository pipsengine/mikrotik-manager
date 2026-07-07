# Network Control Center

Network Control Center manages every user and device connected to MikroTik networks.

Capabilities:

- Overall and per-device bandwidth utilization.
- Device identity with IP, MAC, hostname, interface, VLAN, user, department, location, status, uptime and last seen.
- User activity using DNS logs, visited domains, blocked domains, firewall hits, queue counters, DHCP/ARP data, Hotspot/PPPoE users and supported integrations.
- Website, application and social media controls.
- Per-device, user, group, department, VLAN, guest and scheduled bandwidth limits.
- Special access devices with reason, scope, expiry, approver and audit.
- Bulk device actions.
- Time-based access scheduler.
- Firewall filter, NAT, mangle, address-list and queue-rule change workflow.
- Usage, blocked attempt, activity and bandwidth reports.

HTTPS limitation:

Normal HTTPS traffic is not deeply inspected unless a supported proxy, DNS filtering engine, firewall integration or endpoint agent is used. The platform classifies and controls access through DNS/domain matching, address lists, firewall rules, Layer7 where suitable, TLS SNI where available, traffic counters and external filtering integrations.

AI guardrail:

AI must never apply network-control changes directly. It must read current configuration, generate a proposed policy, show affected devices/users, show risk, take backup, request approval, execute only after approval, validate, log and rollback if required.
