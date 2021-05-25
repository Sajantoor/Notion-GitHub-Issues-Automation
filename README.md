# Notion GitHub Issues Automation
> Gets issues from GitHub and puts them in your Notion database automatically using GitHub Actions.

#### Table of Contents
* [About](#About)
* [Getting Started](#Getting-Started)

## About 
Makes project management and organization with Notion easier. This project can be added as as GitHub Action and automatically takes issues from your GitHub repository to your Notion database when an issue is created. This project uses the newly public Notion API to read and update the database and the GitHub API to fetch issues.

Future Features:
 * Authentication for GitHub private repositories. 
 * Better markdown support for issues (Unsupported by API)
 * Add user information.
 * Add date added (Requires specific format not in the Notion API).
 * Add better label support.
 * Create or update an issue on Notion and have it sync to GitHub issues. 


## Getting Started

.env:
```
repo = "your user name/your repo name"
NOTION_API_KEY = "your notion api key"
NOTION_DATABASE = "your notion database id"
NOTION_PAGE_ID = "your notion page id which contains your database"
```
