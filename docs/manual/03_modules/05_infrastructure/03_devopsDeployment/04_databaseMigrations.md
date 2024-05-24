# Database Migrations

## Create Migration File
1. Run the following command in your iR Engine repo:
```bash
cd packages/server-core
```
2. Run the following command to generate a `TIMESTAMP_NAME.ts` migration file _(eg: `20230418102549_eks-column.ts`)_ in your in `server-core` folder:  
```bash
npm run migrate:make -- {NAME}
```
> eg: `npm run migrate:make -- eks-column`
3. Move the migration file to your service's `migrations` folder.  
  ie. `packages/server-core/src/setting/aws-setting/migrations`
4. Update that file with code to match your needs.

## OpenAPI
Our server is set up with Swagger documentation to automatically generate from most endpoints.  
A few custom routes are not documented, but most of the basic stuff is.

You can see the OpenAPI docs in on our [dev cluster](https://api-dev.etherealengine.com/openapi), or locally for a running iR Engine instance at:  
https://localhost:3030/openapi

