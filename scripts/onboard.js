//deals with onboard.html

class Awnser{
    constructor(awsnerLabel, pointsto){
        this.awnser = awnserLabel;
        this.pointsto = pointsto;
        this.button = document.createElement("button");
        this.document.body.appendChild(this.button);
    }
}

class Question{
    constructor(questionLabel){
        this.question = questionLabel;
    }
    makeAwnser(awnser){
        this.awnsers.append(awnser);
    }
}

class Page{
    constructor(href){
        this.href = href;
    }
}

let explorePage = new Page("not made yet");
let exploreBackendPage = new Page("not made yet");
let publishPage = new Page("not made yet");
let teachPage = new Page("/create.html");

let initialQuestion = new Question("do you want to learn code?");
initialQuestion.makeAwnser(new Awnser("yes"), "2")

let awnserMatrix = {
    "do you want to learn code?":{
        "yes":{
            "what do you want to learn about code?":{
                "how to make games":{
                    gamesMatrix
                },
                "how to make websites":{
                    websiteMatrix
                },
                "how to make robots":{
                    robotWebsite
                },
                "data analysis / AI":{
                    dataAnalysisMatrix
                },
                "to look cool / hack":{
                    fakeHackingSite
                }
            }
        },

        "no":{
            "do you want anything to do with code?":{
                "yes":{
                    "what do you want to do?":{
                        "teach others": {
                            teachPage
                        },
                        "browse code": {
                            exploreBackendPage
                        },
                        "publish code": {
                            publishPage
                        }
                    }
                },
                "no":{
                    explorePage
                }
            }
        }
    }
}

let gamesMatrix = {
    "do you want to use a game engine?": {
        "yes": {
            "do you know a language similar to one of these?": {
                "python":{
                    godot
                },
                "javascript":{

                },
                "c#":{
                    "unity":{

                    },
                    "unreal":{

                    }
                },
                "nope":{
                    "where would you like to learn about game engines?":{
                        "youtube":{
                            youtubeGameEngineInfo
                        },
                        ""
                    }
                }
            }
        },

        "no": {
            "good luck":{
                
            }
        }

    }
}

let websiteMatrix = {
    
}