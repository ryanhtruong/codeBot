import fetch from "node-fetch";

// interface containing variables for building 'create' runner request to interact with Paiza API
// see http://api.paiza.io/docs/swagger/#!/runners/Runners_create
// NOTE: bot is only currently using members that are explicitly required
interface Create {
    source_code: string;
    language: string;
    input?: string;
    longpoll?: boolean;
    longpoll_timeout?: number;
}



export default class Handler {

    // base url to access Paiza API - will exist in every Paiza URL
    private baseUrl: string;

    // using a set for O(1) access time when using .has()
    private validLanguages: Set<string>;

    // assigning default values to class members in constructor
    constructor() {
        this.baseUrl = "http://api.paiza.io:80/runners/";
        this.validLanguages = new Set([
            "bash", "c", "c#", "c++", "clojure", "cobol", "coffeescript", "d", "elixir", "erlang ",
            "f#", "go", "haskell", "java", "javascript", "kotlin", "mysql", "nadesiko", "objective-c", 
            "perl", "php", "python2", "python3", "r", "ruby", "rust", "scala", "scheme", "swift", "typescript", "vb"
        ]);
    }

    // parses intention from user input and acts accordingly
    public async selectCmd(msg: any) {
        // get command selection from msg
		let content : string[] = msg.content.substring(1).split(' ');
		// initialize promise 
		let data: any;
		switch(content[0].toLowerCase()) {
            case "create":
                this.createRunner(msg);
                break;
            case "get_status":
                console.log(content[1]);
                data = await this.getStatus(content[1]);
                // TODO: Implement output
                console.log(data);
                msg.reply(`\`\`\`
                id: ${data.id}
                status: ${data.status}\`\`\``);
                break;
            case "get_details":
                console.log(content[1]);
                data = await this.getDetails(content[1]);
                // TODO: Implement output
                msg.reply(`\`\`\`
                id: ${data.id}
                language: ${data.language}
                status: ${data.status}
                stdout: ${data.stdout}
                stderr: ${data.stderr}
                exit_code: ${data.exit_code}
                time: ${data.time}
                memory: ${data.memory}
                connections: ${data.connections}
                result: ${data.result}\`\`\``);
                break;
            default:
                msg.reply("ERROR: Available actions are '/create', '/get_status', '/get_details'.");
        }
    }

    public getValidLanguages() {
        return this.validLanguages;
    }

    // handles™ errors for the Handler™
    // homemade exception handler
    private checkCreateValid(msg: any, create: Create) {

        // build error message for user - useful for if the user input fails on multiple fronts
        let errorResponse: string = "";

        // inform user language is invalid -- given language cannot be handled by Paiza.
        if (!this.validLanguages.has(create.language)) {
            errorResponse = errorResponse.concat("Input language not accepted. ");
        }

        // inform user code is invalid -- must be encased by ```.
        if (create.source_code == "") {
            errorResponse = errorResponse.concat("Please encase your code in a multi-line code block using ```. ");
        }

        // error message built if error found, so inform user then return false
        if (errorResponse != "") {
            msg.reply(`ERROR: ${errorResponse}`);
            return false;
        }

        return true;

    }

    // builds components of POST runner session to build and run code with Paiza, then outputs to user
    public async createRunner(msg: any) {
        let content = msg.content.slice(8);
        const create: Create = {
            source_code: this.parseCode(content),
            language: this.parseLanguage(content)
            // TODO: accept input args (optional) from user
        }

        console.log(create);

        if (!this.checkCreateValid(msg, create)) {
            console.log("returning null")
            return null; }

        let url = this.buildCreateURL(create);
        let response = await this.post(create, url);

        // use getDetails in order to retrieve stdout from user program
        let details = await this.getDetails(response.id);
            ;
        msg.reply(`\`\`\`
        iD: ${response.id}
        source_code: ${create.source_code}
        stdout: ${details.stdout}\`\`\``);
    }

    // POST method takes action - run create runner
    private async post(create: Create, url: string) {
        
        const response = await fetch(url, {
            method: "POST"
        }).then((response) => response.json());
        
        return response;
    }

    // GET method - gets status of request
    public async getStatus(id: string) {
        let url = `http://api.paiza.io:80/runners/get_status?id=${id}&api_key=guest`;
        const response = await fetch(url, {
            method: "GET"
        }).then((response) => response.json());
        return response;
    }

    // GET method - gets details of some request (use this to output stdout from a POST)
    public async getDetails(id: string) {
        let url = `http://api.paiza.io:80/runners/get_details?id=${id}&api_key=guest`;
        const response = await fetch(url, {
            method: "GET"
        }).then((response) => response.json());
        return response;
    }

    // builds URL for 'create' runner request
    private buildCreateURL(create: Create): string {
        // url format is baseUrl + /create?/source_code=[insert code here]&language=[insert language here]&api_key=guest
        let url = this.baseUrl + `create?source_code=${create.source_code}&language=${create.language}&api_key=guest`;
        return url;
    }

    // parses code out of input
    private parseCode(content: string): string {
        // code should be nested in discord's multi-line block
        // code within content should be encased between the first and last occurrences of ``` in content
        
        /* 
            NOTE for future update:
            When bot is updated to allow optional inputs, they will occur in user input after -i flag.
            When searching for code, this input after -i flag should be excluded from search as it could contain ```.
            As a consequence, content.lastIndexOf("```") will not be usable.
        */

        let start = content.indexOf("```");
        let end = content.lastIndexOf("```");
        let result = (start != -1 && end != -1)? content.slice(start + 3, end) : "";

        return result;
    }
    

    // parses language out of input
    private parseLanguage(content: string) {
        // if content.indexOf(' ') returns -1 then language is the last part of user input (INVALID INPUT)
        // need to ensure in this case that we do not slide from (0, -1) in order for the Handler to throw correct errors
        let index: number = content.indexOf(' ');

        let lang = (index != -1)? content.slice(0, content.indexOf(' ')).toLowerCase() : content;

        // if input is invalid return empty string

        return (this.validLanguages.has(lang))? lang : "";
    }

}

