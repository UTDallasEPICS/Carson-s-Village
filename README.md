# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Dependency Software to Install
Nodejs, Docker, IDE with command line, Git, WSL2 (windows only)
* Note: Docker will ask you to create an account for Docker, which is not required for most development. Don't make the account unless you like having your data harvested.

## Setup

Clone repsitory 

Copy .env into root or fill out new keys from .env.example

Need Private keys for 
 - Stripe
 - AWS
 - Auth0
 Need 
 - email source for AWS SES
 - S3 bucket URL
 - Auth0 Issuer URL

Install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Run Docker 
Start Docker Desktop
Change the director to prisma/local
Run docker compose
```bash
cd prisma/local
docker-compose up
```

## Initialize Database

Initialize Postgres DB via
```bash
npx prisma generate
```
Add first user with prisma studio with valid email that you can use
```bash
npx prisma studio
```
And add email and user role as admin for maximium privilege
And optionally add
    - First name
    - Last namme
    - Middle name
    - Phone number
or 

Add first user via Postgres CLI
Enter Postgres CLI
``` bash
docker exec -it local-db-1 psql -U postgres
```
Enter first user with your email set to a usable email
``` bash
 insert into user_accounts(cuid, email, first_name, last_name, user_role) values ('your_name', 'your_email', 'your_first_name', 'your_last_name','admin')
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Interacting with site

Log in via the 'Login' button and use Auth0 with the previously entered email

## docker-compose.yml location
The docker-compose file is located in /prisma/local for local development

## Schema location
The schema is in prisma and is in /prisma

## UI Mockups Folder
The ui mockups are located in /figma

## Workflow diagrams
The workflow diagrams are located in /flowcharts

## Notes for the langauges of the tech stack
Notes on the current tech are located in /notes

## Current Deployment Scheme
The main and stage branches automatically deploys to pages.carsonsvillage.org  and pages-staged.carsonsvillage.org respectively via an AWS EC2 instance built via GitHub actions for testing.
The deployment scripts are in /.github/workflows.

# Migration Scripts
None
Carsonsvillage.org, the previous solution, is not ever green so the data will start from scratch
on future Carson's Village's usage of this project.

# Conceptual Overview

This system is focused around advocates, families, and pages. Advocates invite families and guide them through the process of creating a memorial page. These pages contain obituaries, times, and locations. These pages are publicly viewable and searchable. Pages can receive donations, have donation goals, and have deadlines for fundraising. Family users can only access the system after being invited by an advocate. Family users have profiles. Admin distributes donations to families.

# Functional Requirements

## Edit Page
 - Logged in users can create pages with the following properties filled in:
  - Name
  - Day of birth (optional)
  - Day of passing (optional)
  - Visitation (optional)
    - Date
    - Location
    - Description
  - Funeral (optional)
    - Date
    - Location
    - Description
  - Obituary
  - Donation goal (optional)
  - Deadline (optional)
  - Images (optional)
   - Images can be added
    - one by one
    - multiple at a time
   - Viewable via image preview feature
   - Images can be deleted one by one
   - User can select profile picture

## Users

- There are three roles: family, dvocate, admin
- Users are invite only, regardless of roles
- Admin(s) are entered through CLI only
- Admins can do what advocates can do and only admins can
  - Distribute Donations via Stripe
- Only advocates can
  - Toggle Page active/inactive status
  - Invite users
  - See a list of all pages
  - See a list of all users
  - See Family Reports
  - Change the role of a user
- All logged in users can
  - Edit a page
  - See a list of their own pages
- Only Family Users need to do onboarding for using a connected account via Stripe Connect
- Users are authenticated via Auth0
- Users receive invitation emails via AWS SES

## Family Pages

- All pages can be viewed publicly
- Pages must be publicly searchable
- Pages have
  - Name
  - Day of birth
  - Day of passing
  - Visitation
    - Date
    - Location
    - Description
  - Funeral
    - Date
    - Location
    - Description
  - Obituary
  - Donation goal
  - Amount donated
  - Deadline
  - Images
  - Donations
    - Processed through stripe
  - Donation comments associated to a donation
  - Page Replies not associated to a donation
  - Page sharing links to
    - Facebook
    - X (formally known as Twitter)
    - Mail Application

## Family Report Page
  - Family Reports can be viewed by Advocates and Admin(s)
  - Family Report can be downloaded to CSV
  - Family Report columns are 
    - Page name
    - Advocate Responsible name
    - Donation Performance metrics
        - Duration
        - Donation Status
        - Goal Met Date
    - Donation Payout Metrics
        - Owed / Goal Percentage
        - Amount Owed
        - Amount Paid
        - Amount Raised
    - Start Date
    - Donation Goal

## Donation Managment Page
  - Donation Managment page can only be viewed by an Admin
  - Admin can distribute donations to a family page or family
  - Admin can view family and page's 
    - total amount raised
    - total amount distributed
    - total amount left to distribute
  - Admin can view all of family's donations

## Family Creation Page
  - Admin and Advocate can create family and the first user
  - First user is invited via AWS SES

## User Invite Page
   - Admin and Advocate can create a user with the following properties
     - Role (advocate or family)
     - Select Family via listbox for family role 
     - First Name
     - Middle Name
     - Last name
     - Phone number

## Home 
 - Every Logged in user can view their
    - First, middle, last name
    - Role
    - Phone number

## Page List
  - Advocates can view all pages of families they are responsible for
  - Advocates can select family to view pages for
  - Families can view all of their pages
  - Page list shows 
   - Page name
   - Donation Deadline
   - link to edit
   - link to view
   - Only admin and advocates can view user cuid of page creator
   - Show up to 12 family pages per page 

## User List 
  - Advocates and Admins can view all users
  - User List shows 
    - User name
    - User email
    - User id
    - User Family name for family members
    - User role
    - Link to user page list of pages they created
    - Show up to 12 Users per page

## Search Page
  - Show up to 12 results of pages searched per page
  - Search by matching any character of page name
  - Show all pages with empty query

## Stack
Nuxt, postgres, prisma

## Research Questions
None

## Third party integrations

- Stripe for payments and donation payouts
- Auth0 for authentication
- AWS SES for emails

## Deployment

AWS EC2
