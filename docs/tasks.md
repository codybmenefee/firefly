# Firefly Tracker App - Project Management & Best Practices

## Development Workflow
1. **Branching:** Feature branches from `main`, PRs for all changes
2. **Code Review:** At least one review before merge
3. **Commits:** Clear, descriptive messages
4. **Testing:** Focus on user-centric flows, not granular unit tests
5. **Documentation:** Update docs with every major change
6. **Environment:** Keep `.env.example` files up to date for both frontend and backend

## Best Practices
- Keep files <300 lines; refactor as needed
- Use clear, consistent naming
- Comment code for readability
- Modularize logic (hooks, utils, components)
- Use environment variables for secrets
- If CLI tools fail, document and use manual config as needed (e.g., Tailwind CSS)

## Testing Strategy
- End-to-end user flow tests (Cypress or Playwright)
- Manual smoke tests for new features
- No granular unit tests unless critical

## Onboarding for Junior Developers
- Read `/docs/architecture.md` and `/docs/tasks.md` first
- Follow the directory structure and naming conventions
- Ask for help early and often
- Prioritize working, testable features over perfection
- If you encounter CLI issues (e.g., Tailwind), check README for manual config steps

## Task Tracking
- Use `/docs/MVP/tasks.md` for MVP-specific tasks
- Update task files for each phase (Alpha, Beta, etc.) 
- [INFO] MVP database connectivity step complete: db-test Edge Function is deployed and confirms DB connection

## Task Tracking
- Use `/docs/MVP/tasks.md` for MVP-specific tasks
- Update task files for each phase (Alpha, Beta, etc.) 