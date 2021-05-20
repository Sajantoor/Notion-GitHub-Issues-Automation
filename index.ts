import dotenv = require('dotenv');
import fetch from 'node-fetch';
// import Client from '@notionhq/client';
const { Client } = require('@notionhq/client');

// get info from .env file
dotenv.config();

const USERNAME = process.env.user;
const REPO = process.env.repo;
const DATABASE_ID = process.env.NOTION_DATABASE;
const PAGE_ID = process.env.NOTION_PAGE_ID;

const GITHUB_API = `https://api.github.com/repos/${USERNAME}/${REPO}/issues`
const NOTION_API = new Client({ auth: process.env.NOTION_API_KEY });

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
async function postNotion(title_content: string | undefined, state: string | undefined, url : string | undefined, date : string) {
    let dateObj = new Date(date);
    let dateString = dateObj.toISOString();

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
                    content: title_content,
                  },
                },
              ],
            },

            'State': {
                select: {
                    name: state,
                }
              },

            'Last Updated': {
                date: dateString, 
            }, 

            'URL': {
                url: url,
            },

            
          },
    });

    return response;
}

async function main() {
    let GH_RESULTS = await fetchGitHub();
    
    for (let index = 0; index < 1; index++) {
        const element = GH_RESULTS[index];
        postNotion(element.title, element.state, element.html_url, element.updated_at);
    }

    return;
}

main();

/**
 * Creates a new page, can't do anything else because API sucks :(
 */
// async function initDatabaseNotion() {
//     const response = await NOTION_API.pages.create({
//         parent: {            
//            page_id: PAGE_ID,
//         },
//         properties: {
//             title: [
//                 {
//                     type: 'text',
//                     text: {
//                         content: 'Hello, World!',
//                     },
//                 },
//             ]
//         },
//     });

//     console.log(response);
// }

// initDatabaseNotion();
 