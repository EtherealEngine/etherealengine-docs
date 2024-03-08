# Email Service
## Set up Simple Email Service (optional)

If you want to enable email magiclink login, you will need to set up Simple Email Service (SES).

In the AWS web client, go to SES -> Configuration -> Verified Identities. Click Create Identity, then under 'Identity type'
select 'Domain'. Enter the top-level domain under the 'Domain' field. Finally, click the 'Create identity' button.

### Create SMTP credentials
You need to create SMTP credentials in order to authorize SES. These will show up as an IAM user,
but you must go through an SES-specific process to get valid credentials; just creating an IAM user
with SESFullAccess will not work.

Go to an SES page and select 'SMTP Settings', then click the button 'Create SMTP Credentials'.
You can leave the default IAM User Name as-is; click the Create button. You should be taken to a screen
says a user has been created successfully. Click on 'Show User SMTP Security Credentials'.

You will see a Username and Password. These credentials will go into the Helm config file, under
AWS_SMTP_USER and AWS_SMTP_PASS, respectively. You must also fill in the region that you've created these credentials 
in, replacing \<SES_REGION\> in api.extraEnv.SMTP_HOST.

### Move SES out of Sandbox
By default, SES domains are in Sandbox mode, where they can only send emails to verified email addresses.
To request that the domain be moved out of Sandbox mode, go to SES->Email Sending->Sending Statistics.
Click on the button 'Edit your account details' to open the modal. Set 'Enable Production Access' to Yes,
leave Mail type on 'Transactional', then fill in the Website URL, add a Use case description (basically
just assure them that this is for account login only, not anything else), click the checkbox to agree
to their TOD, and click the button 'Submit for review'.

It may take up to a few days for them to take action. If the request is rejected, address their concerns.
Once you have been approved, email login should work for any email address.

#### Verifying test emails
Before you have production use for your SES domain, in order to log in you'll have to verify specific email
addresses with SES. Go to SES->Identity Management->Email Addresses. Click on the button 'Verify a New Email
Address'. Enter the address you want to test with, then click 'Verify This Email Address'. You should soon
receive an email with a link to verify it (it may go to your Spam folder). Once you've followed the link,
you can log in with that address.
