import dotenv = require('dotenv');
import fetch from 'node-fetch';

/* -----------------
   Startup
   ----------------
*/

// get info from .env file
dotenv.config();

let repoName = process.env.repo;

// fetch from github api for new issues 
// access notion api to post to database containing github repo details

/**
 * Fetch from the GitHub API to get new issues related to this repo 
 */
function fetchGithub(): void {

}
