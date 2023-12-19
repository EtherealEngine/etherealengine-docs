## Kick off GitHub Actions
In GitHub, if you go to back to the Actions tab, you should see a `dev-deploy` action. Click on it, and you should see
a page showing its status, which should be all green checkmarks or indicators that things didn't run. In the upper
right, click `Re-run all jobs`. This will start it again, and now that `DEPLOYMENTS_ENABLED` is set to true, it should
attempt to build and deploy the builder.
    
(If actions were disabled at first, you'll have to merge additional code into the dev branch to get it to start the dev-deploy process)

### Overview of the build process
The full build and deployment process works like this:
1. GitHub Actions builds just enough of the Ethereal Engine monorepo to fetch any installed Ethereal Engine projects.
2. GitHub Actions pushes this builder Docker image to the repo `etherealengine-<release>-builder` in ECR
3. GitHub Actions updates the builder deployment to point to the builder image it just created.
4. The builder deployment spins up the builder Docker image on its single node
5. The builder connects to the deployment's database and checks if there is a table `user`. This is a proxy
    for the database being seeded; if it does not exist, it seeds the database with the basic Ethereal Engine schema,
    seeds the default project into the database and storage provider, and seeds various types.
6. The builder downloads any Ethereal Engine projects that the deployment has added.
7. The builder builds the Docker image for each service concurrently using these projects, building them into the client files as well as copying them so that the api and instanceservers have access to them.
    If serving client files from the Storage Provider, the client files will be pushed to S3
8. The builder pushes these final Docker images to the repos `etherealengine-<release>-<service>` in ECR (not the client image if serving client files from the Storage Provider)
9. The builder caches all of the layers of each Docker file in S3 for faster build times on subsequent builds
10. The builder updates the main deployment to point to the final images it just created.
11. The main deployment spins up the final Docker images for the api, client (optional), instanceserver and taskserver services.
