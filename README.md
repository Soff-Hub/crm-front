## SOFF CRM

## Stack technologies
- [React](https://react.dev/learn) + [Typescript](https://www.typescriptlang.org/docs/)
- [redux](https://redux.js.org/) - Small, fast, and scalable bearbones state management solution
- [Material UI](https://mui.com) - As ready-made UI components
- [Formik](https://formik.org) - Performant, flexible and extensible forms with
- [Bootstrap](https://getbootstrap.com/) - For styles
- [Nextjs](https://Nextjs.org/) - framework for SSR

## Basic requirements for the project

> [!NOTE]
> Vesion Node +v20\*

## For Developers

```bash
npm i
# and
npm run dev
# or
yarn install
# and
yarn dev
```

Run the project at [localhost:3000](http://localhost:3000)

### To launch the project in the production environment, run the command:

```bash
npm i
npm run build
npm run dev
# or
yarn install
yarn build
yarn dev
```

run the project at [localhost:3000](http://localhost:3000)

> [!NOTE]
> You need to create `.env.development` following the example of `.env.example` so that all parameters are

# GIT

## Push to git

> [!NOTE]
> When pushing to git, the task given on **Trello** is thrown to the brand with the Id

### Created branch

```bash
git checkout -b feat/TASK_ID
```

### Switch to another branch

```bash
git switch feat/TASK_ID
```

### Push to git branch

> [!WARNING]
> Check that the branch is in the your task branch

```bash
git add .
git commit -m "YOUR_COMMENT"
git push origin feat/TASK_ID
```

### Get Pull from the main code (from dev branch)

```bash
git pull origin dev
```

#### Get Pull from the main code (from dev branch) rebase

> [!WARNING]
> Ff git pull asks for rebase, you can get git pull from **dev** branch with this command

```bash
git pull origin dev --no-rebase
# or
git pull origin dev --rebase
```

> [!CAUTION]
> Inform the **TEAM LEAD** that every time a pull PR is released on github, the code will be reviewed. And if there is a task code review, it goes to the **dev** branch and then moves to the next task!

## Git conventional commit types
- **`feat:`** – Feature (Adding a new feature)
- **`init:`** – Initial (Initial setup or creation)
- **`chore:`** – Chore (Routine tasks or maintenance, not affecting code functionality)
- **`fix:`** – Fix (Bug fixes or error corrections)
- **`refactor:`** – Refactor (Code restructuring without changing functionality)
- **`docs:`** – Documentation (Changes to documentation files)
- **`style:`** – Style (Formatting, spacing, linting; no code logic changes)
- **`test:`** – Test (Adding or modifying tests)
- **`perf:`** – Performance (Improving code performance)
- **`build:`** – Build (Changes related to the build system or dependencies)

## Code Review

    1) If the code is not ready, then mark your PR as “Draft” with the “Mark as draft” button
    2) Considers Architectural, Structural and other agreements on the design of PR to be critical and for this is not passed further than PR
    3) The remaining comments are purely advisory in nature and are not a blocker for PR
    4) Any controversial issue is discussed by the team and if there is no violation of points 1-2, then this dispute is not blocked!

## ☝️ - IMPORTANT:

> - To type everything and anything that is possible is not to use ANY!
> - any enemy! - always discuss exceptions with the team!
> - avoid console.log if possible, in extreme cases console.error console.warn
> - mutate values ​​outside the mobx store (use exclusively actions from the mobx store for such things.)
