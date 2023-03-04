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
var node_fetch_1 = require("node-fetch");
/*  Introducing the Handler™
    Surname: Handler™
    Given name: The
    Likeness: (⌐■_■)
    Age: old as time
    Occupation: Handler
    Hobbies: dexterity tricks //please get the joke//
    Graduation Quote: "i'll Handle™ this (⌐■_■)"
    Fun fact: brought a collection of stolen door handles to 5th grade show-and-tell
*/
var Handler = /** @class */ (function () {
    // assigning default values to class members in constructor
    function Handler() {
        this.baseUrl = "http://api.paiza.io:80/runners/";
        this.validLanguages = new Set([
            "bash", "c", "c#", "c++", "clojure", "cobol", "coffeescript", "d", "elixir", "erlang ",
            "f#", "go", "haskell", "java", "javascript", "kotlin", "mysql", "nadesiko", "objective-c",
            "perl", "php", "python2", "python3", "r", "ruby", "rust", "scala", "scheme", "swift", "typescript", "vb"
        ]);
    }
    // parses intention from user input and acts accordingly
    Handler.prototype.selectCmd = function (msg) {
        // get command selection from msg
        var content = msg.content.substring(1).split(' ');
        // initialize promise 
        var promise;
        switch (content[0].toLowerCase()) {
            case "create":
                this.createRunner(msg);
                break;
            case "get_status":
                promise = this.getStatus(msg);
                msg.reply("".concat(promise));
                break;
            case "get_details":
                promise = this.getDetails(msg);
                msg.reply("".concat(JSON.stringify(promise)));
                break;
            default:
                msg.reply("ERROR: Available actions are 'create', 'get_status', 'get_details'.");
        }
    };
    Handler.prototype.getValidLanguages = function () {
        return this.validLanguages;
    };
    // handles™ errors for the Handler™
    // homemade exception handler
    Handler.prototype.checkCreateValid = function (msg, create) {
        // build error message for user - useful for if the user input fails on multiple fronts
        var errorResponse = "ERROR: ";
        // inform user code is invalid -- must be encased by ```.
        if (create.source_code == "ERROR: Please encase your code in a multi-line code block using ```.") {
            console.log("checkCreateValid >> source code input invalid");
            errorResponse = "Please encase your code in a multi-line code block using ```.";
        }
        // inform user language is invalid -- given language cannot be handled by Paiza.
        if (!this.validLanguages.has(create.language)) {
            console.log("checkCreateValid >> language input invalid");
            errorResponse.concat(errorResponse, "Your language is not accepted by Paiza.");
        }
        // error message built if error found, so inform user then return false
        if (errorResponse != "ERROR: ") {
            msg.reply(errorResponse);
            return false;
        }
        return true;
    };
    // builds components of POST runner session to build and run code with Paiza, then outputs to user
    Handler.prototype.createRunner = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var content, create, url, response, details, reply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = msg.content.slice(8);
                        create = {
                            source_code: this.parseCode(content),
                            language: this.parseLanguage(content)
                            // TODO: accept input args (optional) from user
                        };
                        if (!this.checkCreateValid(msg, create)) {
                            return [2 /*return*/, null];
                        }
                        url = this.buildCreateURL(create);
                        return [4 /*yield*/, this.post(create, url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.getDetails(response.id)];
                    case 2:
                        details = _a.sent();
                        reply = "Request ID: ".concat(response.id, "\nInput: ").concat(create.source_code, "\nOutput: ").concat(details.stdout);
                        msg.reply(reply);
                        return [2 /*return*/];
                }
            });
        });
    };
    // POST method takes action - run create runner
    Handler.prototype.post = function (create, url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "POST"
                        }).then(function (response) { return response.json(); })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // GET method - gets status of request
    Handler.prototype.getStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "http://api.paiza.io:80/runners/get_status?id=".concat(id, "&api_key=guest");
                        return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                                method: "GET"
                            }).then(function (response) { return response.json; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // GET method - gets details of some request (use this to output stdout from a POST)
    Handler.prototype.getDetails = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "http://api.paiza.io:80/runners/get_details?id=".concat(id, "&api_key=guest");
                        return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                                method: "GET"
                            }).then(function (response) { return response.json(); })];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // builds URL for 'create' runner request
    Handler.prototype.buildCreateURL = function (create) {
        // url format is baseUrl + /create?/source_code=[insert code here]&language=[insert language here]&api_key=guest
        var url = this.baseUrl + "create?source_code=".concat(create.source_code, "&language=").concat(create.language, "&api_key=guest");
        return url;
    };
    // parses code out of input
    Handler.prototype.parseCode = function (content) {
        // code should be nested in discord's multi-line block
        // code within content should be encased between the first and last occurrences of ``` in content
        /*
            NOTE for future update:
            When bot is updated to allow optional inputs, they will occur in user input after -i flag.
            When searching for code, this input after -i flag should be excluded from search as it could contain ```.
            As a consequence, content.lastIndexOf("```") will not be usable.
        */
        var start = content.indexOf("```");
        var end = content.lastIndexOf("```");
        var result = (start != -1 && end != -1) ? content.slice(start + 3, end) : "ERROR: Please encase your code in a multi-line code block using ```.";
        return result;
    };
    // parses language out of input
    Handler.prototype.parseLanguage = function (content) {
        // if content.indexOf(' ') returns -1 then language is the last part of user input (INVALID INPUT)
        // need to ensure in this case that we do not slide from (0, -1) in order for the Handler to throw correct errors
        var index = content.indexOf(' ');
        return (index != -1) ? content.slice(0, content.indexOf(' ')).toLowerCase() : content;
    };
    return Handler;
}());
exports["default"] = Handler;
