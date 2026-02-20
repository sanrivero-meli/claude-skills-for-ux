# Adding a skill to Skills Hub

## Requirements

Your skill needs three files in a single folder:

```
your-skill-name/
├── SKILL.md      ← the actual skill instructions for Claude
├── README.md     ← what it does, how to use it (shown on the site)
└── meta.json     ← metadata for filtering and display
```

## meta.json format

```json
{
  "name": "Your Skill Name",
  "description": "One sentence. What it does and when to use it.",
  "author": "your-github-handle",
  "category": "design | engineering | writing | data | productivity | finance",
  "tags": ["tag1", "tag2"],
  "platform": ["claude-code"],
  "requires": [],
  "version": "1.0.0",
  "createdAt": "YYYY-MM-DD"
}
```

## Steps

1. Fork or clone this repo
2. Create your folder under `/skills/your-skill-name/`
3. Add your three files
4. Push and open a PR — or if you're an editor, push directly to main
5. The site rebuilds automatically on Vercel

## Questions?

Ping @srivero on Slack.
