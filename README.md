## Serverless Architecture
Serverless computing allows you to build and run applications and services without thinking about servers. Serverless applications don't require you to provision, scale, and manage any servers. You can build them for virtually any type of application or backend service, and everything required to run and scale your application with high availability is handled for you.

## Topics
- [Setup AWS Account](#setup-aws-account)
- [Create an IAM User](#create-an-iam-user)
- [Set Up the AWS Command Line Interface for Linux And Configure it](#set-up-the-aws-command-line-interface-for-linux-and-configure-it)
- [Creating an Lambda Function and deployment](#creating-an-lambda-function-and-deployment)
- [Creating and Configuring API Gateway API](#creating-and-configuring-api-gateway-api)
- [Creating, Configuring and Uploading in S3 Bucket](#creating-configuring-and-uploading-in-s3-bucket)
- [Configure an S3 Bucket for Static Website Hosting](#configure-an-s3-bucket-for-static-website-hosting)
- [Run existing Node.js application on top of AWS Lambda and Amazon API Gateway](#run-existing-nodejs-application-on-top-of-aws-lambda-and-amazon-api-gateway)

## Setup AWS Account
- Open https://aws.amazon.com/, and then choose Create an AWS Account.
- Follow the online instructions.


## Create an IAM User
- Use your AWS account root user email address and password to sign in as the to the IAM console at https://console.aws.amazon.com/iam/.
- In the navigation pane, choose Users and then choose Add user.
- For User name, type a username, such as Administrator. The name can consist of letters, digits, and the following characters: plus (+), equal (=), comma (,), period (.), at (@), underscore (_), and hyphen (-). The name is not case sensitive and can be a maximum of 64 characters in length.
- Select the checkbox of Programmatic access to enables an access key ID and secret access key for the AWS API, CLI, SDK, and other development tools.
- Choose Next: Permissions.
- On the Set permissions for user page, choose Add user to group.
- In the Create group dialog box, type the name for the new group. The name can consist of letters, digits, and the following characters: plus (+), equal (=), comma (,), period (.), at (@), underscore (_), and hyphen (-). The name is not case sensitive and can be a maximum of 128 characters in length.
- In the policy list, select the checkbox next to AdministratorAccess. Then choose Create group.
- Choose Next: Review to see the list of group memberships to be added to the new user. When you are ready to proceed, choose Create user.
- Choose Next: Review to see the list of group memberships to be added to the new user. When you are ready to proceed, choose Create user.


## Set Up the AWS Command Line Interface for Linux And Configure it
- Use apt-get install to install the latest version of the AWS CLI.

```sh
$ sudo apt-get install awscli
```
- For general use, the aws configure command is the fastest way to ]    set up your AWS CLI installation.
```sh
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```
The AWS CLI will prompt you for four pieces of information. AWS Access Key ID and AWS Secret Access Key are your account credentials.

- To get the access key ID and secret access key for an IAM user
    - Open the IAM console.
    - In the navigation pane, choose Users.
    - Choose your IAM user name (not the check box).
    - Choose the Security credentials tab and then choose Create access key.
    - To see the new access key, choose Show. Your credentials will look something like this:
        - Access key ID: AKIAIOSFODNN7EXAMPLE
        - Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPL
        - To download the key pair, choose Download.csv file. Store the keys in a secure location.
    - Keep the keys confidential in order to protect your account, and never email them. Do not share them outside your organization, even if an inquiry appears to come from AWS or Amazon.com. No one who legitimately represents Amazon will ever ask you for your secret key.
    

## Creating an Lambda Function and deployment
- Open a text editor, and write your code. Save the file (for example, filename.js).
```sh
exports.handler = (event, context,callback) => {
    callback(null,”Hello World”);
}
```
You will use the file name to specify the handler at the time of creating the Lambda function.

- In the same directory, use npm to install the libraries that your code depends on. For example, if your code uses the async library, use the following npm command.
  Eg:npm install async
- Your directory will then have the following structure:
```sh
filename.js
node_modules/async
node_modules/async/lib
node_modules/async/lib/async.js
node_modules/async/package.json
```
- Zip the content of the folder, that is your deployment package. Then, specify the .zip file name as your deployment package at the time you create your Lambda function. If you want to include your own binaries, including native ones, just package them in the Zip file you upload and then reference them (including the relative path within the Zip file you created) when you call them from Node.js or from other processes that you’ve previously started.
- Open https://aws.amazon.com/lambda, and then choose Create function.
- Click on Author from scratch button and click Next.
- Fill Basic Information and upload .zip file that created previously. 
- Select Role as choose existing role and Existing Role as Administrator, then Next.
- Finally, test the lambda function.

## Creating and Configuring API Gateway API
- Open https://aws.amazon.com/apigateway, and then choose Get Started.
- Choose Create API from the API Gateway APIs home page.
- From Create new API, select New API, type a name in API Name, optionally add a description in  Description, and then choose Create API.
- Choose Actions then select Create Resource.
- Tick Configure as proxy resource checkbox and it automatically fills out fields and Tick Enable API Gateway CORS checkbox and choose Create Resource.
- In the method's Setup pane, select Lambda Function Proxy for Integration type, select region  where lambda function is hosted from the Lambda Region drop-down list and type the name of function you want to use, then click on save.
- To deploy the API, select the API and then choose Deploy API from the Actions drop-down menu.
- In the Deploy API dialog, choose a stage (or [New Stage] for the API's first deployment); enter a name (e.g., "test", "prod", "dev", etc.) in the Stage name input field; optionally, provide a description in Stage description and/or Deployment description; and then choose Deploy.
- Once deployed, you can obtain the invocation URLs (Invoke URL) of the API's endpoints.


## Creating, Configuring and Uploading in S3 Bucket
- Open https://aws.amazon.com/s3, and then Choose Create bucket.
- On the Name and region page, type a name for your bucket and choose the AWS Region where you  want the bucket to reside. Complete the fields on this page as follows:
  - For Bucket name, type a unique DNS-compliant name for your new bucket. Follow these naming guidelines:
    - The name must be unique across all existing bucket names in Amazon S3.
    - The name must not contain uppercase characters.
    - The name must start with a lowercase letter or number.
    - The name must be between 3 and 63 characters long.
    - After you create the bucket you cannot change the name, so choose wisely.
    - Choose a bucket name that reflects the objects in the bucket because the bucket name is visible in the URL that points to the objects that you're going to put in your bucket.
- If you copied settings from another bucket, choose Create. You're done, so skip the following steps and If not, choose Next.
- On the Set properties page, you can configure the following properties for the bucket. Or, you can configure these properties later, after you create the bucket
    - **Logging** – Server access logging provides detailed records for the requests made to your bucket. By default, Amazon S3 does not collect server access logs. To enable logging for the bucket, choose Logging. To disable logging, choose Disable logging. Choose Save to save your settings. For more information, see Server Access Logging in the Amazon Simple Storage Service Developer Guide
    - **Tags** – With AWS cost allocation, you can use tags to annotate billing for your use of a bucket. A tag is a key-value pair that represents a label that you assign to a bucket. To add tags, choose Tags, and then choose Add tag.
    - **Versioning** – Versioning enables you to keep multiple versions of an object in one bucket. Versioning is disabled for a new bucket by default.
- Choose Next.
- On the Set permissions page, you manage the permissions that are set on the bucket that you are creating. You can also make changes to permissions after you create the bucket and When you're done configuring permissions on the bucket, choose Next.
- On the Review page, verify the settings. If you see something you want to change, choose Edit. If your current settings are correct, choose Create bucket.
- In the Bucket name list, choose the name of the bucket that you want to upload your folders or files to.
- In the Upload dialog box, choose Add files.
- Choose one or more files to upload, and then choose Open.
- After you see the files that you chose listed in the Upload dialog box, do one of the following:
    - To add more files, choose Add more files.
    - To immediately upload the listed files, choose Upload.
    - To set permissions or properties for the files that you are uploading, choose Next.
- On the Upload review page, verify that your settings are correct, and then choose Upload. To make changes, choose Previous.


## Configure an S3 Bucket for Static Website Hosting
- Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.
- In the Bucket name list, choose the name of the bucket that you want to enable static website hosting for.
- Choose Properties.
- Choose Static website hosting , then enable your bucket for static website hosting, web browsers can access all of your content through the Amazon S3 website endpoint for your bucket.
- Choose Use this bucket to host.
  - For Index Document, type the name of the index document, which is typically named index.html. When you configure a bucket for website hosting, you must specify an index document. Amazon S3 returns this index document when requests are made to the root domain or any of the subfolders.
  -  For 4XX class errors, you can optionally provide your own custom error document that provides additional guidance for your users. For Error Document, type the name of the file that contains the custom error document. If an error occurs, Amazon S3 returns an HTML error document. 
  - If you want to specify advanced redirection rules, in the Edit redirection rules text area, use XML to describe the rules. For example, you can conditionally route requests according to specific object key names or prefixes in the request
  - Choose Save.
  - Add a bucket policy to the website bucket that grants everyone access to the objects in the bucket. When you configure a bucket as a website, you must make the objects that you want to serve publicly readable. To do so, you write a bucket policy that grants everyone s3:GetObject permission. The following example bucket policy grants everyone access to the objects in the example-bucket bucket.

  ```sh
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::example-bucket/*"
            ]
        }
    ]
}
```
**Note**
If you choose Disable website hosting, Amazon S3 removes the website configuration from the bucket, so that the bucket is no longer accessible from the website endpoint. However, the bucket is still available at the REST endpoint.

## Run existing Node.js application on top of AWS Lambda and Amazon API Gateway
- Goto the existing Node.js application directory, here open a text editor and write your code.
Save the file(for example, lambda.js) 

```sh
 const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
```
You will use the file name to specify the handler at the time of creating the Lambda function.

- In the same directory, use npm to install **aws-serverless-express** library.
- Zip the content of the folder, that is your deployment package. Then, specify the .zip file name as your deployment package at the time you create your Lambda function. If you want to include your own binaries, including native ones, just package them in the Zip file you upload and then reference them (including the relative path within the Zip file you created) when you call them from Node.js or from other processes that you’ve previously started.
- Open https://aws.amazon.com/lambda, and then choose Create function.
- Click on Author from scratch button and click Next.
- Fill Basic Information and upload .zip file that created previously. 
- Select Role as choose existing role and Existing Role as Administrator, then Next.
- Configure test event by click action button, select **API Gateway AWS Proxy** and configure **Input test event**.
- Finally, save and test the lambda function.
- To configure API Gateway follow [Creating and Configuring API Gateway API](#creating-and-configuring-api-gateway-api).

