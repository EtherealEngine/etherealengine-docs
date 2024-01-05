# Database Migrations

## Create Migration File

1. In your ethereal engine repo run following command
```
  cd packages/server-core
```
2. Afterward run following command to generate migration file:  `TIMESTAMP_NAME.ts` i.e. `20230418102549_eks-column.ts` in `server-core` folder.
```
  npm run migrate:make -- {NAME}
```
i.e.
```
  npm run migrate:make -- eks-column
```
3. Move the migration file to your service's `migrations` folder. i.e. `packages/server-core/src/setting/aws-setting/migrations`
4. Update that file with code to match your needs.

## OpenAPI
Our server is set up with Swagger documentation to automatically generate from most endpoints. A few custom routes are not documented at this time, but most of the basic stuff is.

You can see the docs for a running Ethereal Engine instance locally at:
```
https://localhost:3030/openapi
```

Or on our [dev cluster](https://api-dev.etherealengine.com/openapi)
