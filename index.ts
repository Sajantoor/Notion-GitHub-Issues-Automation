const dotenv = require('dotenv');
import fetch from 'node-fetch';
const { Client } = require('@notionhq/client');
const fs = require('fs'); // DEV: for development

// get info from .env file
dotenv.config();

const REPO = process.env.repo;
const DATABASE_ID = process.env.NOTION_DATABASE;
const PAGE_ID = process.env.NOTION_PAGE_ID;

const GITHUB_API = `https://api.github.com/repos/${REPO}/issues`
const NOTION_API = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Fetch from the GitHub API to get new issues related to our working repo 
 * @return Response a promise from the GitHub API
 */
async function fetchGitHub() {
    let response = await fetch(GITHUB_API);
    let data = await response.json();
    return data;
}

/**
 * For development to prevent unnecessary calls to the GitHub API. (It has limits)
 * @returns Result from GitHub API JSOn
 */
function fetchGitHubDEV() {
  let rawdata = fs.readFileSync('dev/github.json');
  return JSON.parse(rawdata);
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
 * Query the database, provides matching results
 * @return response from Notion API
 */
async function queryNotion() {
  const response = await NOTION_API.databases.query({
    database_id: DATABASE_ID, 
    // filter: {
      
    // },
    sorts: [
      {
        property: 'Number',
        direction: 'descending',
      }
    ]
  });

  return response;
}

/**
 * 
 * @param title_content 
 * @param state 
 * @param url 
 * @param number 
 * @param body 
 * @returns response from NOTION API
 */
async function postNotion(title_content: string, state: string, url : string, number : number, body : string) {
    const response = await NOTION_API.pages.create({
        parent: {
            database_id: DATABASE_ID,
        },
        properties: {
            'Name': {
              type: 'title',
              title: [
                createTextObject(title_content),
              ],
            },

            'State': {
                select: {
                    name: capitalize(state),
                }
              },

            'Number': {
                number: number,
              },

            'URL': {
                url: url,
            },

            // TODO: dates require a certain format but it's not in the Notion API documentation :(
            // 'Last Updated': {
            //     date: dateString, 
            // },   
        },

        children: [
          {
            object: 'block', 
            type: 'paragraph',
            paragraph: {
              text: [
                createTextObject(body), // TODO: Fix markdown mess, seems unsupported by API currently
              ]
          }
        },

        // TODO: Get user info and insert it, after markdown
        // {
        //   object: 'block',
        //   type: 'heading_1',
        //   heading_1: {
        //     text: [
        //       createTextObject('User Info:'),
        //     ]
        //   }
        // },
      ]
    });

    return response;
}

/**
 * Creates a new page, can't do anything else because API sucks :(
 */
async function initDatabaseNotion() {
    const response = await NOTION_API.pages.create({
        parent: {            
           page_id: PAGE_ID,
        },
        properties: {
            title: [
                  createTextObject('Hello, world!'),
            ]
        },
    });

    return response;
}

/**
 * 
 * @param str String to capitalize
 * @returns String with first letter capitalized
 */
function capitalize(str : string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Helper function to remove some syntax and make code easier to read.
 * @param content String we want to pass to the text object
 * @returns Text object
 */
function createTextObject(content: string): object {
  // fixed NULL string error
  if (content == null) {
    content = "";
  }
  
  return {
    type: 'text',
    text: {
      content: content,
    },
  }
} 

/**
 * Data is already sorted (in decending order) so binary search for the number we want to find.
 * @param notionData Data from the Notion database query
 * @param num Number we want to find 
 * @param start index to start from 
 * @param n length of the array
 * @returns if the database contains the number
 */
function notionContains(notionData : any, num : number, start : number, n : number): boolean {
  let half = Math.round((start + n) / 2);

  if (start <= n) {
    let halfVal = notionData?.results[half]?.properties?.Number?.number;

    if (halfVal === num) {
      return true; 
    } else if (halfVal < num) { // if it's greater than look at first half 
      return notionContains(notionData, num, 0, half - 1); 
    } else if (halfVal > num) { // if it's less than look at second half
      return notionContains(notionData, num, half + 1, n);
    }
  }

  return false;
}

async function main() {
  const GH_RESULTS = await fetchGitHub(); 
  const NOTION_RESULTS = await queryNotion(); // check if it's in the database already before adding it
    
  for (let index = 0; index < GH_RESULTS.length; index++) {
      const element = GH_RESULTS[index];
      const number = element.number;
      const notionMax = NOTION_RESULTS?.results[0]?.properties?.Number?.number; // max number 

      // add it if it's greater than the max number, won't be in the database or if it the database doesn't contain the issue
      if (number > notionMax || !notionContains(NOTION_RESULTS, number, 0, NOTION_RESULTS?.results?.length)) {
          postNotion(element?.title, element?.state, element?.html_url, element?.number, element?.body);
      } 
  }

  return;
}

main();