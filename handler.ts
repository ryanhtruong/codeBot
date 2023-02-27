// interface for building Create runner to interact with Paiza API
// see http://api.paiza.io/docs/swagger/#!/runners/Runners_create
interface Create {
    source_code : String;
    language : String;
    input? : String;
    longpoll? : boolean;
    longpoll_timeout? : number;
}

export default class handler {

    

}

