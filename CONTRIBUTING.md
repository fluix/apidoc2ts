# How to contribute

I'm glad that you are reading this, cause that means that you are here to help on improving the tool. Awesome, feel welcome and read the following sections in order to know how to do that so everyone is happy.

### I found a bug

First of all, check that the bug was not already reported by searching on GitHub under [issues](https://github.com/fluix/apidoc2ts/issues).

If the bug was not reported, [open a new issue](https://github.com/fluix/apidoc2ts/issues/new/choose) with a "bug" label and provide a title and clear description containing: 
- list of steps to perform in order to reproduce the bug
- description of the expected and actual behaviour
- samples of expected and actual results
- sample code (if any)
- info about your operational system and nodejs version

### I want to request a new feature/improvement

Simply [open a new issue](https://github.com/fluix/apidoc2ts/issues/new/choose) with an "enhancement" label and explain your idea in details.

### I want to make a new feature/improvement

You dont need to do any additional steps in order to start working on a project, but there are some useful commands and tricks:
- `$ npm run monitor` will run tests in watch mode and will rerun them on every change
- `$ npm run lint` will run tslint and print all issues in human readable format
- `$ npm link` will make a link the local package instead of global and thus any change you make will be immediately available

Also we have a precommit hook that will run all tests and code-style linter and will prevent a commit if any of them fails.

### I fixed a bug or made an improvement

Open a new GitHub pull request with the patch. Description should clearly describe the problem and solution, what have been done and what changed. If it is a fix for a specific issue reference it by adding the number of that issue.

### Code conventions?

Currently we are following the extended Airbnb code style and have tslint rules for that. We use UpperCamelCase for files and kebab-case for directories. Also we are covering with tests every piece of functionality that we have. Besides that commit messages should consist of one-line header with a present tense imperative and a longer description of what and probably why something have been changed if needed.

Branch names should start with specific prefix and follow up with some description in kebab-case after slash.
Prefixes:
- `feat` - for any new features
- `fix` - for any fixes
- `impr` - for small improvements
- `ref` - for refactoring

If a branch contains several types of this changes then the prefix should reflect the main purpose of the branch/PR.

Examples:
- `feat/add-new-feature`
- `fix/fixed-some-bug`

