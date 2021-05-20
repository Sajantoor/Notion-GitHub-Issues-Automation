import dotenv = require('dotenv');
import fetch from 'node-fetch';
// import Client from '@notionhq/client';
const { Client } = require('@notionhq/client');

// get info from .env file
dotenv.config();

const USERNAME = process.env.user;
const REPO = process.env.repo;

const GITHUB_API = `https://api.github.com/repos/${USERNAME}/${REPO}/issues`
const NOTION_API = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE;

/**
 * Fetch from the GitHub API to get new issues related to our working repo 
 * @return Response a promise from the  GitHub API
 */
async function fetchGitHub() {
    let response = await fetch(GITHUB_API);
    let data = await response.json();
    return data;
}


/**
 * Fetch from the Notion API and get information about our database
* @return returns a promise from the Notion API 
*/
async function fetchNotion() {
    const response = await NOTION_API.databases.retrieve({
      database_id: DATABASE_ID,
    });

    return response;
}

/**
 * Post to the Notion API 
 */
async function postNotion() {
    const response = await NOTION_API.pages.create({
        parent: {
            database_id: DATABASE_ID,
        },
        properties: {
            'Name': {
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Hello, World!',
                  },
                },
              ],
            },
          },
    });

    console.log(response);
}

// postNotion();