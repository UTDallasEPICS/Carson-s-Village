# Conceptual Overview

This system is focused around advocates, families, and pages. Advocates invite families and guide them through the process of creating a memorial page. These pages contain obituaries, times, and locations. These pages are publicly viewable and searchable. Pages can receive donations, have donation goals, and have deadlines for fundraising. Family users can only access the system after being invited by an advocate. Family users have profiles.

# Functional Requirements

## Users

- There are three roles: family, advocate, admin
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

## Stack
Nuxt, postgres, prisma

## Research Questions
None

## Third party integrations

- Stripe for payments, Donation Distribution
- Auth0 for authentication
- AWS SES for emails
- Constant Contacts for newsletter integration

## Deployment

AWS EC2
