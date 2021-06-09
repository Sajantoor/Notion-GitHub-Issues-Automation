"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dotenv = require('dotenv');
var node_fetch_1 = require("node-fetch");
var Client = require('@notionhq/client').Client;
var fs = require('fs'); // DEV: for development
var core = require('@actions/core'); // for GitHub actions, accessing variables.
var github = require('@actions/github'); // also for GitHub actions
// get info from .env file
dotenv.config();
var REPO = core.getInput('repo');
var DATABASE_ID = core.getInput('NOTION_DATABASE');
var PAGE_ID = core.getInput('NOTION_PAGE_ID');
var GITHUB_API = "https://api.github.com/repos/" + REPO + "/issues";
var NOTION_API = new Client({ auth: core.getInput('NOTION_API_KEY') });
/**
 * Fetch from the GitHub API to get new issues related to our working repo
 * @return Response a promise from the GitHub API
 */
function fetchGitHub() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"](GITHUB_API)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
/**
 * For development to prevent unnecessary calls to the GitHub API. (It has limits)
 * @returns Result from GitHub API JSOn
 */
function fetchGitHubDEV() {
    var rawdata = fs.readFileSync('dev/github.json');
    return JSON.parse(rawdata);
}
/**
 * Fetch from the Notion API and get information about our database
* @return returns a promise from the Notion API
*/
function fetchNotion() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, NOTION_API.databases.retrieve({
                        database_id: DATABASE_ID
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
/**
 * Query the database, provides matching results
 * @return response from Notion API
 */
function queryNotion() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, NOTION_API.databases.query({
                        database_id: DATABASE_ID,
                        // filter: {
                        // },
                        sorts: [
                            {
                                property: 'Number',
                                direction: 'descending'
                            }
                        ]
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
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
function postNotion(title_content, state, url, number, body) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, NOTION_API.pages.create({
                        parent: {
                            database_id: DATABASE_ID
                        },
                        properties: {
                            'Name': {
                                type: 'title',
                                title: [
                                    createTextObject(title_content),
                                ]
                            },
                            'State': {
                                select: {
                                    name: capitalize(state)
                                }
                            },
                            'Number': {
                                number: number
                            },
                            'URL': {
                                url: url
                            }
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
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
/**
 * Creates a new page, can't do anything else because API sucks :(
 */
function initDatabaseNotion() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, NOTION_API.pages.create({
                        parent: {
                            page_id: PAGE_ID
                        },
                        properties: {
                            title: [
                                createTextObject('Hello, world!'),
                            ]
                        }
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
/**
 *
 * @param str String to capitalize
 * @returns String with first letter capitalized
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Helper function to remove some syntax and make code easier to read.
 * @param content String we want to pass to the text object
 * @returns Text object
 */
function createTextObject(content) {
    // fixed NULL string error
    if (content == null) {
        content = "";
    }
    return {
        type: 'text',
        text: {
            content: content
        }
    };
}
/**
 * Data is already sorted (in decending order) so binary search for the number we want to find.
 * @param notionData Data from the Notion database query
 * @param num Number we want to find
 * @param start index to start from
 * @param n length of the array
 * @returns if the database contains the number
 */
function notionContains(notionData, num, start, n) {
    var _a, _b, _c;
    var half = Math.round((start + n) / 2);
    if (start <= n) {
        var halfVal = (_c = (_b = (_a = notionData === null || notionData === void 0 ? void 0 : notionData.results[half]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.Number) === null || _c === void 0 ? void 0 : _c.number;
        if (halfVal === num) {
            return true;
        }
        else if (halfVal < num) { // if it's greater than look at first half 
            return notionContains(notionData, num, 0, half - 1);
        }
        else if (halfVal > num) { // if it's less than look at second half
            return notionContains(notionData, num, half + 1, n);
        }
    }
    return false;
}
function main() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var GH_RESULTS, NOTION_RESULTS, index, element, number, notionMax;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fetchGitHub()];
                case 1:
                    GH_RESULTS = _e.sent();
                    return [4 /*yield*/, queryNotion()];
                case 2:
                    NOTION_RESULTS = _e.sent();
                    for (index = 0; index < GH_RESULTS.length; index++) {
                        element = GH_RESULTS[index];
                        number = element.number;
                        notionMax = (_c = (_b = (_a = NOTION_RESULTS === null || NOTION_RESULTS === void 0 ? void 0 : NOTION_RESULTS.results[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.Number) === null || _c === void 0 ? void 0 : _c.number;
                        // add it if it's greater than the max number, won't be in the database or if it the database doesn't contain the issue
                        if (number > notionMax || !notionContains(NOTION_RESULTS, number, 0, (_d = NOTION_RESULTS === null || NOTION_RESULTS === void 0 ? void 0 : NOTION_RESULTS.results) === null || _d === void 0 ? void 0 : _d.length)) {
                            postNotion(element === null || element === void 0 ? void 0 : element.title, element === null || element === void 0 ? void 0 : element.state, element === null || element === void 0 ? void 0 : element.html_url, element === null || element === void 0 ? void 0 : element.number, element === null || element === void 0 ? void 0 : element.body);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
