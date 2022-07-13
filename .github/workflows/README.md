![Ethereal Engine logo light mode](https://user-images.githubusercontent.com/507127/176916054-e2ddf82b-b8c6-4e9a-8607-44b6430f38ea.png#gh-light-mode-only)

![Ethereal Engine logo dark mode](https://user-images.githubusercontent.com/507127/176916201-238cbf8f-7a79-4bdb-83b7-87c8edec1df1.png#gh-dark-mode-only)

# Github Actions

Included here are all of the Github Actions that can be used to perform deployments,
run test builds, publish publish packages, and more.

If you're forking this branch to make your own version, you probably don't need to run most of
these actions, and if you're making a private copy, you have a limited number of minutes for
Github actions per month. As as result, all of the actions conditionally run based on associated
Github Secrets being explicitly set to 'true', so a fork won't run any of them by default.

## documentation.yml
This action runs Docusaurus build to create documentation for everything and deploys it 

There is one secret controlling this action:

*`DOCUMENTATION_BUILD_ENABLED` - setting it to true will enable the action
