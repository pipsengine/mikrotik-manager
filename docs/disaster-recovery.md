# Disaster Recovery

Recovery model:

- Encrypted backups are retained according to policy.
- Every configuration change creates a rollback point.
- Validation failure triggers rollback workflow.
- Audit logs preserve before and after state.
- Worker queues can resume background jobs after Redis and database recovery.
