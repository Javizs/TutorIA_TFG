# Security Policy

Do not commit real secrets, credentials, private URLs, certificates or local configuration files.

Required runtime secrets must be configured through environment variables and documented only in `.env.example` with empty placeholder values.

Before deploying, review authentication, API routes, database permissions, OpenAI API key scope, rate limiting and production environment configuration.

If a secret is exposed in Git history or shared externally, rotate it immediately and clean the repository history before publishing.
