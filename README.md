# parse-front-matter-action

![run-tests](https://github.com/kjirou/parse-front-matter-action/actions/workflows/run-tests.yml/badge.svg)

A GitHub Action to parse YAML Front Matter

## :meat_on_bone: Features

- Interprets and separates the [YAML Front Matter](https://jekyllrb.com/docs/front-matter/) of the content and returns it as JSON.
- The type of content that can be interpreted complies with [gray-matter](https://www.npmjs.com/package/gray-matter).

## :rocket: Simple Example

```yaml
on:
  workflow_dispatch:
jobs:
  run-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: parse-front-matter
        uses: kjirou/parse-front-matter-action@v1
        with:
          content: "---\ntitle: Title\n---\n## Headline\n\nText"
      - run: |
          echo '${{ steps.parse-front-matter.outputs.frontMatterAsJson }}'
          echo '${{ steps.parse-front-matter.outputs.body }}'
```

The above workflow produces the following output:

```
{"title":"Title"}
## Headline

Text
```

## :cat: Practical Example

This is an example of a GitHub Workflow for submitting a routine issue via [`workflow_dispatch`](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch).

```yaml
on:
  workflow_dispatch:
    inputs:
      template-id:
        required: true
jobs:
  run-action:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: read-template
        uses: juliangruber/read-file-action@v1
        with:
          path: ./issue-templates/${{ inputs.template-id }}.md
      - id: parse-front-matter
        uses: kjirou/parse-front-matter-action@v1
        with:
          content: ${{ steps.read-template.outputs.content }}
      - uses: actions/github-script@v6
        env:
          BODY: ${{ steps.parse-front-matter.outputs.body }}
          FRONT_MATTER_AS_JSON: ${{ steps.parse-front-matter.outputs.frontMatterAsJson }}
        with:
          script: |
            const frontMatter = JSON.parse(process.env.FRONT_MATTER_AS_JSON);
            const title = frontMatter.title || 'No title';
            const body = process.env.BODY.trim();
            const labels = Array.isArray(frontMatter.labels) ? frontMatter.labels : [];
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title,
              body,
              labels,
            });
```

`issue-templates/routine-task.md`

```md
---
title: A Routine Task
labels:
  - good first issue
---

## A Routine Task

- Hello!
- Goodby!
```

After executing, you will be able to submit an issue as shown in [this image](/documents/routine-task.png).

## :hammer_and_wrench: Development

### Preparation

- [Node.js](https://nodejs.org/)
  - The version is defined in [.nvmrc](/.nvmrc).

### Installation

```
git clone git@github.com:kjirou/parse-front-matter-action.git
cd ./parse-front-matter-action
npm install
```

### Debugging Notes

- After changing JS, execute `npm run build` and push it.
- Run manual testing with [the `manual-testing` workflow](https://github.com/kjirou/parse-front-matter-action/actions/workflows/manual-testing.yml).
- Versioning was done manually.
