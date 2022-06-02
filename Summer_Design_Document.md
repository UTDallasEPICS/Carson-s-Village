# Design Document - Summer 2022
#### Alexis Jennings, Evelyn Kha
****
## Summary
The objective of this summer project is to expedite the progress of the Carson’s Village Automated Family Pages project for deployment in the fall semester. We will be working on the following tasks:
1. Completion of authentication features that will secure the login for family members as well as Carson’s Village admins.
2. Completion of User Interface (UI/UX) enhancements for the current project, also known as the front-end.
## Duration
The project’s duration will be two months. The first month will be focused on implementing authentication, and the second month will be focused on completing the front-end of the project.
## Timeline
```mermaid
%%{init: {'theme': forest } }%%
gantt
	dateFormat	YYYY-MM-DD
	title		Carson’s Village Project Summer Schedule
	excludes	weekends

	section Critical Tasks
	Read up on Auth0, CSS, talk about Auth system design	:active, 2022-06-01, 4d
	Implement users, design user addition system & UX (admin/family)	:active, 2022-06-06, 6d
	Implement user addition system & Auth guards	:active, 2022-06-13, 6d
	Testing and debugging user addition system & Auth guards		:active, 2022-06-20, 6d
	Implement site headers/nav etc. into main display page	:active, 2022-06-20, 11d
	1 Month Retrospective	:milestone, 2022-07-01, 0d
	Redesign admin section	:active, 2022-07-04, 6d
	CSS/flex & testing	:active, 2022-07-11, 11d
	Update docs	:active, 2022-07-18, 6d
	Final Review	:active, 2022-07-25, 6d
	Retrospective	:milestone, 2022-07-31, 0d
```
## Mock-Ups/Requirements
### Authentication
Authentication design will integrate auth0, an authorization tool that centralizes authentication and identity management, into the current codebase. 
- Will be a secure process because auth0 will keep track of the passwords without us having to store it in our database

Auth0 will also include a single sign on (SSO) feature that will validate the user using a supported third-party. 
- For example, admins from carsonsvillage.org can login and family clients can use their gmail account. 

### User Interface Upgrade
- Implementing a user-friendly design for the page creation feature we created
- Website theme will match the Carson’s Village official website style