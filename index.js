'use strict';
//var https = require ('https');
var responses = require('resources/AlexaResponses');
var funfact = require ('resources/facts');
//var imageResponse = require ('resources/images');
var soundEffect = require ('resources/soundEffect');

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title,text, output, repromptText, img, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: output,
        },
        card: {
      "type": "Standard",
      "title": title,
      "text": text
    },
        reprompt: {
            outputSpeech: {
                type: 'SSML',
                ssml: repromptText,
            },
        },
      "shouldEndSession":shouldEndSession
    };
}



function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

 function getWelcomeResponse(launchRequest,callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {"repeatMessage":""};
    const cardTitle = 'स्वागत हे';
     var speechOutput;
    var repromptText ;
    var text = "भारतीय  भाषा  Facts में आपका स्वागत है";
  
     	speechOutput='<speak>'+responses.responses.welcome+' क्या तुम्हें पता था  <break time="0.5s"/>'+funfact.facts[Math.round(Math.random() * ((funfact.facts.length - 1) - 0) + 0)]+' . अधिक सुनने के लिए <break time="0.5s"/> और  <break time="0.5s"/> कहें<break time="0.5s"/>फिर से सुनने के लिए कहें  <break time="0.5s"/>दोहराएं  '+'</speak>';
     	//	speechOutput='<speak>'+responses.responses.welcome+'</speak>';
    repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
   //var img = imageResponse.Img.welcome[Math.round(Math.random() * ((imageResponse.Img.welcome.length - 1) - 0) + 0)];
     var img;
     sessionAttributes.repeatMessage = speechOutput;
     callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText,img, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'अलविदा';
    const speechOutput = '<speak><audio src="'+soundEffect.sound[Math.round(Math.random() * ((soundEffect.sound.length - 1) - 0) + 0)]+'"/>'+responses.responses.good_bye+'</speak>';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;
    var text = responses.responsesgood_bye;

    callback({}, buildSpeechletResponse(cardTitle,text, speechOutput, null,null, shouldEndSession));
}

function getHelpResponse(req, session, callback){
      var sessionAttributes;
    if(session.attributes === undefined){
        sessionAttributes = {"repeatMessage":""};
    }else{
         sessionAttributes = {"repeatMessage":session.attributes.repeatMessage};
    }
    const cardTitle = 'मदद';
    const speechOutput = '<speak>'+responses.responses.help+'</speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = null; //image link
    var text = responses.responses.help;
     sessionAttributes.repeatMessage = speechOutput;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
}
//------------------------FUNCTION------------------------------

 
function getFunfactResponse(req, session, callback){
    var sessionAttributes;
    if(session.attributes === undefined){
        sessionAttributes = {"repeatMessage":""};
    }else{
         sessionAttributes = {"repeatMessage":session.attributes.repeatMessage};
    }
      
     const cardTitle = 'भारतीय  भाषा  Facts';
     var quoteNumber = Math.round(Math.random() * ((funfact.facts.length - 1) - 0) + 0);
    const speechOutput = '<speak><audio src="'+soundEffect.sound[Math.round(Math.random() * ((soundEffect.sound.length - 1) - 0) + 0)]+'"/>'+funfact.facts[quoteNumber]+' . अधिक सुनने के लिए <break time="0.5s"/> और  <break time="0.5s"/> कहें<break time="0.5s"/>फिर से सुनने के लिए कहें  <break time="0.5s"/>दोहराएं  '+'</speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
   // var img = imageResponse.Img.general[Math.round(Math.random() * ((imageResponse.Img.general.length - 1) - 0) + 0)];
    var img;
    var text = funfact.facts[quoteNumber];
    sessionAttributes.repeatMessage = speechOutput;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
} 

function getFallbackResponse(req, session, callback){
    var sessionAttributes
       if(session.attributes === undefined){
        sessionAttributes = {"repeatMessage":""};
    }else{
         sessionAttributes = {"repeatMessage":session.attributes.repeatMessage};
    }
    const cardTitle = 'परेशान';
    var quoteNumber = Math.round(Math.random() * ((funfact.facts.length - 1) - 0) + 0);
    const speechOutput = '<speak>क्षमा करें, मुझे वह नहीं मिला लेकिन क्या आप जानते हैं <break time="1s"/>'+funfact.facts[quoteNumber]+' . अधिक सुनने के लिए <break time="0.5s"/> और  <break time="0.5s"/> कहें<break time="0.5s"/>फिर से सुनने के लिए कहें  <break time="0.5s"/>दोहराएं  '+'</speak>';
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = null; //image link
    var text = responses.responses.somethingElse;
    sessionAttributes.repeatMessage = speechOutput;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
}

function getRepeatResponse(req, session, callback){
     const cardTitle = 'Response दोहराना';
    var speechOutput;
    if(session.attributes !== undefined && session.attributes.repeatMessage !== undefined && session.attributes.repeatMessage !== ""){
        speechOutput = session.attributes.repeatMessage;
    }else{
        speechOutput = '<speak>दोहराने के लिए कुछ भी नहीं है</speak>';
    }
     
    const repromptText = responses.responses.reprompt;
    const shouldEndSession = false;
    var img = null; //image link
    var text = responses.responses.somethingElse;
    var sessionAttributes = session.attributes;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle,text, speechOutput, repromptText, img, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
    // Dispatch to your skill's launch.
    getWelcomeResponse(launchRequest,callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(req, session, callback) {
   // console.log(`onIntent requestId=${req.request.requestId}, sessionId=${session.sessionId}`);

console.log("---------request-------------",req);
    //const intent = req.request.intent;
    const intentName = req.request.intent.name;


    // Dispatch to your skill's intent handlers
    if (intentName === 'more') {
	   getFunfactResponse(req, session, callback);
    }else if (intentName === 'start') {
	   getFunfactResponse(req, session, callback);
	}else if (intentName === 'somethingElse') {
       getFallbackResponse(req, session, callback);              
    }else if (intentName === 'AMAZON.RepeatIntent') {
       getRepeatResponse(req, session, callback);
    }else if (intentName === 'AMAZON.FallbackIntent') {
       getFallbackResponse(req, session, callback);
    }else if (intentName === 'AMAZON.HelpIntent') {   
        getHelpResponse(req, session, callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
    
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
       // console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.ask.skill.73902b0f-1de3-4e91-95c4-d94b32d5eb19') {
             callback('Invalid Application ID');
        }
        */
console.log("---------event-----------",event);
        if (event.session!==undefined && event.session.new) {
            
            onSessionStarted({ requestId: event.request.requestId }, event.session);
            
        }

        if (event.request.type === 'LaunchRequest') {
            console.log("------------------launch request-----------------------");
            onLaunch(event,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
