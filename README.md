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
 * Add date added (Requires specific format not mentioned in the Notion API?).
 * Add better label support.
 * Create or update an issue on Notion and have it sync to GitHub issues. 


## Getting Started

### Step 1: Create an Integration
* Go to https://www.notion.com/my-integrations.
* Click the "+ New integration" button.
* Give your integration a name.
* Select the workspace where you want to install this integration. 
* Click "Submit" to create the integration. 
* Copy the "Internal Integration Token" on the next page and add it to your repository's secrets.  

![Gif of how to create an Integration](https://files.readme.io/2ec137d-093ad49-create-integration.gif "Gif of how to create an Integration")


### Step 2: Share a database with your integration
* Create a Notion database in any of your pages that you want the API to have access to. 
* The table **must** contain the following fields (remember these are case sensitive): 
    *  Select type called "State" with 2 options called "Open" and "Closed"
    *  URL type called "URL" 
    *  Number type called "Number"
* Click on the "Share" button and invite your integration, this will give read - write permission to the integration. 
![Gif of how to create an Integration](https://files.readme.io/0a267dd-share-database-with-integration.gif "Gif of how to create an Integration")

* Copy the database ID of the URL, this is after the workspace/ and before the question mark. Add this to your repository secrets.
```
https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...
                                  |--------- Database ID --------|
```

### Step 3: Create a workflow
Add this repository's latest stable release to a .github/workflow/action.yml file. Learn more about workflow syntax [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions). 


Example .github/workflows/action.yml file.
```yml
name: "GitHub Notion Issues Automation"

permissions:
    issues: read

# Run code on issue or issue comment
on: 
  [issues] # what causes the action to run, do you want it on push, issue, etc.

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Notion GitHub Issues Automation
        uses: Sajantoor/Notion-GitHub-Issues-Automation@1.0.0
        with:
            # Your current repository.
            repo: ${{ github.repository }} 
            # Your Notion API Key
            NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
            # Your Notion database ID
            NOTION_DATABASE: ${{ secrets.NOTION_DATABASE }}
            # The ID of the page that contains your database
            NOTION_PAGE_ID:  ${{ secrets.NOTION_PAGE_ID }}
```

### Contributing

* Clone or fork this repository.
```
git clone
```

* Install all dependencies with [npm](https://nodejs.org/)
```
npm install
```

* Create a `.env` file with your secrets. 

```
repo = "your repo here (not the full url, just username/reponame eg: facebook/react)"
NOTION_API_KEY = "your integration key here"
DATABASE_ID = "your database ID here"
NOTION_PAGE_ID = "your page ID here (optional)"
```

* Run the project in development.
```
npm run dev
```

> If you're new to open source contributions read [this guide](https://opensource.guide/how-to-contribute/). Issues and pull requests are welcome!
