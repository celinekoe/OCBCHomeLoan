
const CALCULATE_LOAN_INTENT = "CalculateLoan";
const SPECIFY_PROPERTY_INTENT = "SpecifyProperty";
const DEFAULT_FALLBACK_INTENT = "Sorry, I don't know what you mean.";

const CALCULATE_LOAN_CONTEXT = "calculateloan";

exports.loanCalculatorWebhook = (req, res) => {
    let intent = getIntent(req);
    let sessionId = getSessionId(req);
    let contexts = getContexts(req);
    console.log("printing contexts...");
    console.log(contexts);
    console.log("printing intent..." + intent);
    console.log("printing specify property intent..." + SPECIFY_PROPERTY_INTENT);
    console.log(intent === SPECIFY_PROPERTY_INTENT);


    if (intent === CALCULATE_LOAN_INTENT) {
        calculateLoan(res, sessionId);
    } else if (intent === SPECIFY_PROPERTY_INTENT) {
        console.log("specifying property");
        specifyProperty(res, contexts);
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function getSessionId(req) {
    return req.body.session.split("/").pop();
}

function getIntent(req) {
    let intent = req.body.queryResult.intent.displayName;
    return intent;
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
    console.log("setting outputContexts...");
    console.log(outputContexts);
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

function specifyProperty(res, contexts) {
    if (hasCalculateLoanContext(contexts)) {
        console.log("return borrowed amount")
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': "You can borrow $100,000." }));
    } else {
        // TO DO
        console.log("return default fallback intent");
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function hasCalculateLoanContext(contexts) {
    // TO DO
    return true;
}