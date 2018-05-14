
const CALCULATE_LOAN_INTENT = "CalculateLoan";
const SPECIFY_PROPERTY_TYPE_INTENT = "SpecifyProperty";
const SPECIFY_AGE_INTENT = "SpecifyAge";
const DEFAULT_FALLBACK_INTENT = "Sorry, I don't know what you mean.";

const CALCULATE_LOAN_CONTEXT = "calculateloan";

exports.loanCalculatorWebhook = (req, res) => {
    console.log("printing queryResult...");
    console.log(req.body.queryResult);
    let intent = getIntent(req);
    console.log("printing intent..." + intent);
    let propertyType = getPropertyType(req);
    let age = getAge(req);
    console.log("printing age..." + age);

    let sessionId = getSessionId(req);
    let contexts = getContexts(req);
    console.log("printing contexts...");
    console.log(contexts)

    if (intent === CALCULATE_LOAN_INTENT) {
        calculateLoan(res, sessionId);
    } else if (intent === SPECIFY_PROPERTY_TYPE_INTENT) {
        specifyProperty(res, propertyType, sessionId, contexts);
    } else if (intent === SPECIFY_AGE_INTENT) {
        specifyAge(res, age, sessionId, contexts);
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function getIntent(req) {
    let intent = req.body.queryResult.intent.displayName;
    return intent;
}

function getPropertyType(req) {
    let propertyType = "";
    if (req.body.queryResult.parameters["propertyType"]) {
        propertyType = req.body.queryResult.parameters["propertyType"];
    } 
    return propertyType;
}

function getAge(req) {
    let age = "";
    if (req.body.queryResult.parameters["age"]) {
        age = req.body.queryResult.parameters["age"];
    } 
    return age;
}

function getSessionId(req) {
    return req.body.session.split("/").pop();
}

function getContexts(req) {
    let outputContexts = req.body.queryResult.outputContexts;
    let simpleOutputContexts = [];
    if (outputContexts) {
        simpleOutputContexts = outputContexts
        .map(outputContext => {
            return outputContext.name.split("/").pop();
        });
    }
    return simpleOutputContexts;
}

function calculateLoan(res, sessionId) {
    let response = getCalculateLoanResponse(sessionId);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getCalculateLoanResponse(sessionId) {
    let outputContexts = getCalculateLoanOutputContexts(sessionId);
    return {
        "fulfillmentText": "What type of property are you enquiring for?",
        outputContexts,
    };
}

function getCalculateLoanOutputContexts(sessionId) {
    let calculateLoanOutputContext = getCalculateLoanOutputContext(sessionId, 5);
    return [calculateLoanOutputContext];
}

function getCalculateLoanOutputContext(sessionId, lifespanCount) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + CALCULATE_LOAN_CONTEXT,
        lifespanCount,
        "parameters": {},
    };
}

function specifyProperty(res, propertyType, sessionId, contexts) {
    if (hasContext(contexts, CALCULATE_LOAN_CONTEXT)) {
        let response = getSpecifyPropertyResponse(propertyType, sessionId);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    } else {
        // TO DO
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function getSpecifyPropertyResponse(propertyType, sessionId) {
    let outputContexts = getSpecifyPropertyOutputContexts(propertyType, sessionId);
    return {
        "fulfillmentText": "Tell us about your financial background. What is your age?",
        outputContexts,
    };
}

function getSpecifyPropertyOutputContexts(propertyType, sessionId) {
    let calculateLoanOutputContext = getCalculateLoanOutputContext(sessionId, 0);
    let specifyPropertyOutputContext = getSpecifyPropertyOutputContext(propertyType, sessionId, 5);
    return [calculateLoanOutputContext, specifyPropertyOutputContext];
}

function getSpecifyPropertyOutputContext(propertyType, sessionId, lifespanCount) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + CALCULATE_LOAN_CONTEXT,
        lifespanCount,
        "parameters": {
            "propertyType": propertyType,
        },
    };
}

function specifyAge(res, age, sessionId, contexts) {
    if (hasContext(contexts, CALCULATE_LOAN_CONTEXT)) {
        let response = getSpecifyAgeResponse(age, sessionId);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    } else {
        // TO DO
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function getSpecifyAgeResponse(age, sessionId) {
    let outputContexts = getSpecifyAgeOutputContexts(age, sessionId);
    return {
        "fulfillmentText": "What is your total monthly income?",
        outputContexts,
    };
}

function getSpecifyAgeOutputContexts(age, sessionId) {
    let specifyPropertyOutputContext = getSpecifyAgeOutputContext(sessionId, 5);
    return [specifyPropertyOutputContext];
}

function getSpecifyAgeOutputContext(age, sessionId, lifespanCount) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + CALCULATE_LOAN_CONTEXT,
        lifespanCount,
        "parameters": {

        },
    };
}


/*
 *
 * Utility Methods
 *
 */

function hasContext(contexts, findContext) {
    let hasContext = false;
    for (let i = 0; i < contexts.length; i++) {
        let context = contexts[i];
        if (context === findContext) {
            hasContext = true;
        }
    }
    return hasContext;
}