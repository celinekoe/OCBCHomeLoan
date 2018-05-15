
const CALCULATE_LOAN_INTENT = "CalculateLoan";
const SET_PROPERTY_TYPE_INTENT = "SetPropertyType";
const SET_AGE_INTENT = "SetAge";
const SET_MONTHLY_INCOME_INTENT = "SetMonthlyIncome";
const SET_MONTHLY_DEBT_INTENT = "SetMonthlyDebt";
const SET_REPAYMENT_PERIOD_INTENT = "SetRepaymentPeriod";
const SOMETHING_ELSE_INTENT = "SomethingElse";
const DEFAULT_FALLBACK_INTENT = "Sorry, I don't know what you mean.";

const CALCULATE_LOAN_CONTEXT = "calculateloan";
const SOMETHING_ELSE_CONTEXT = "somethingelse";

const PROPERTY_TYPE_PROPERTY = "propertyType";
const AGE_PROPERTY = "age";
const MONTHLY_INCOME_PROPERTY = "monthlyIncome";
const MONTHLY_DEBT_PROPERTY = "monthlyDebt";
const REPAYMENT_PERIOD_PROPERTY = "repaymentPeriod";

const PROPERTY_TYPE_PUBLIC = "public";
const PROPERTY_TYPE_PRIVATE = "private";

const MAX_MORTGAGECOMPARISON_SERVICING_RATIO = 0.3; 
const MAX_TOTAL_DEBT_SERVICING_RATIO = 0.6;

const SOMETHING_ELSE_OPTION_CURRENT = "currentOption";
const SOMETHING_ELSE_OPTION_LOAN_AMOUNT = "loanAmount";
const SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT = "monthlyPayment";

exports.loanCalculatorWebhook = (req, res) => {
    console.log("printing queryResult...")
    console.log(req.body.queryResult);

    let intent = getIntent(req);
    
    if (intent === CALCULATE_LOAN_INTENT) {
        calculateLoan(res);
    } else if (intent === SET_PROPERTY_TYPE_INTENT) {
        setPropertyType(res);
    } else if (intent === SET_AGE_INTENT) {
        setAge(res);
    } else if (intent === SET_MONTHLY_INCOME_INTENT) {
        setMonthlyIncome(res);
    } else if (intent === SET_MONTHLY_DEBT_INTENT) {
        setMonthlyDebt(res);
    } else if (intent === SET_REPAYMENT_PERIOD_INTENT) {
        setRepaymentPeriod(req, res);
    } else if (intent === SOMETHING_ELSE_INTENT) {
        somethingElse(req, res);
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'fulfillmentText': DEFAULT_FALLBACK_INTENT }));
    }
}

function getIntent(req) {
    let intent = req.body.queryResult.intent.displayName;
    return intent;
}

function getContexts(req) {
    return req.body.queryResult.outputContexts;
}

function getSessionId(req) {
    return req.body.session.split("/").pop();
}

/*
 *
 * Calculate Loan
 *
 */

function calculateLoan(res) {
    let response = getCalculateLoanResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getCalculateLoanResponse() {
    return {
        "fulfillmentText": "What type of property are you enquiring for?",
    };
}

/*
 *
 * Set Property Type
 *
 */

function setPropertyType(res) {
    let response = getPropertyTypeResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getPropertyTypeResponse() {
    return {
        "fulfillmentText": "Tell us about your financial background. What is your age?",
    };
}

/*
 *
 * Set Age
 *
 */

function setAge(res) {
    let response = getAgeResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getAgeResponse() {
    return {
        "fulfillmentText": "What is your total monthly income?",
    };
}

/*
 *
 * Set Monthly Income
 *
 */

function setMonthlyIncome(res) {
    let response = getMonthlyIncomeResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getMonthlyIncomeResponse() {
    return {
        "fulfillmentText": "What is your total monthly debt?",
    };
}

/*
 *
 * Set Monthly Debt
 *
 */

function setMonthlyDebt(res) {
    let response = getMonthlyDebtResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getMonthlyDebtResponse() {
    return {
        "fulfillmentText": "What is your expected repayment period?",
    };
}

/*
 *
 * Set Repayment Period
 *
 */

function setRepaymentPeriod(req, res) {
    let contexts = getContexts(req);
    let parameters = getCalculateLoanParameters(req, contexts);

    let response = getRepaymentPeriodResponse(parameters);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getRepaymentPeriodResponse(parameters) {
    let indicativeLoanAmount = getIndicativeLoanAmount(parameters);
    return {
        "fulfillmentText": "Your indicative loan amount is " + indicativeLoanAmount + ". Would you like to know your monthly payment? Or something else?",
    };
}

function getIndicativeLoanAmount(parameters) {
    let indicativeLoanAmount = 0;
    let monthlyNetIncome = getMonthlyNetIncome(parameters);
    if (parameters.propertyType === PROPERTY_TYPE_PUBLIC) {
        indicativeLoanAmount = monthlyNetIncome * 12 * parameters[REPAYMENT_PERIOD_PROPERTY] * MAX_MORTGAGECOMPARISON_SERVICING_RATIO;
    } else if (parameters.propertyType === PROPERTY_TYPE_PRIVATE) {
        indicativeLoanAmount = monthlyNetIncome * 12 * parameters[REPAYMENT_PERIOD_PROPERTY] * MAX_TOTAL_DEBT_SERVICING_RATIO;
    }
    return indicativeLoanAmount;
}

function getMonthlyNetIncome(parameters) {
    let monthlyNetIncome = parameters.monthlyIncome;
    if (parameters.monthlyDebt !== "") {
        monthlyNetIncome -= parameters.monthlyDebt;
    }
    return monthlyNetIncome;
}

/*
 *
 * Get Calculate Loan Parameters
 *
 */

function getCalculateLoanParameters(req, contexts) {
    let propertyType = getPropertyType(req, contexts);
    let age = getAge(req, contexts);
    let monthlyIncome = getMonthlyIncome(req, contexts);
    let monthlyDebt = getMonthlyDebt(req, contexts);
    let repaymentPeriod = getRepaymentPeriod(req, contexts);
    return {
        "propertyType": propertyType,
        "age": age,
        "monthlyIncome": monthlyIncome,
        "monthlyDebt": monthlyDebt,
        "repaymentPeriod": repaymentPeriod,
    };
}

function getPropertyType(req, contexts) {
    let propertyType = "";
    if (req.body.queryResult.parameters[PROPERTY_TYPE_PROPERTY]) {
        propertyType = req.body.queryResult.parameters[PROPERTY_TYPE_PROPERTY];
    } else {
        propertyType = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, PROPERTY_TYPE_PROPERTY);
    }
    return propertyType;
}

function getAge(req, contexts) {
    let age = "";
    if (req.body.queryResult.parameters[AGE_PROPERTY]) {
        age = req.body.queryResult.parameters[AGE_PROPERTY].amount;
    } else {
        tempAge = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, AGE_PROPERTY);
        // NOTE: return value might be empty string
        if (tempAge.amount) {
            age = tempAge.amount;
        }
    } 
    return age;
}

function getMonthlyIncome(req, contexts) {
    let monthlyIncome = "";
    if (req.body.queryResult.parameters[MONTHLY_INCOME_PROPERTY]) {
        monthlyIncome = req.body.queryResult.parameters[MONTHLY_INCOME_PROPERTY];
    } else {
        monthlyIncome = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, MONTHLY_INCOME_PROPERTY);
    } 
    return monthlyIncome;
}

function getMonthlyDebt(req, contexts) {
    let monthlyDebt = "";
    if (req.body.queryResult.parameters[MONTHLY_DEBT_PROPERTY]) {
        monthlyDebt = req.body.queryResult.parameters[MONTHLY_DEBT_PROPERTY];
    } else {
        monthlyDebt = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, MONTHLY_DEBT_PROPERTY);
    } 
    return monthlyDebt;
}

function getRepaymentPeriod(req, contexts) {
    let repaymentPeriod = "";
    if (req.body.queryResult.parameters[REPAYMENT_PERIOD_PROPERTY]) {
        repaymentPeriod = req.body.queryResult.parameters[REPAYMENT_PERIOD_PROPERTY].amount;
    } else {
        tempRepaymentPeriod = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, REPAYMENT_PERIOD_PROPERTY);
        // NOTE: return value might be empty string
        if (tempRepaymentPeriod.amount) {
            repaymentPeriod = tempRepaymentPeriod.amount;
        }
    } 
    return repaymentPeriod;
}

/*
 *
 * Something Else
 *
 */

function somethingElse(req, res) {
    let sessionId = getSessionId(req);
    let contexts = getContexts(req);
    let currentOption = getCurrentOption(req, contexts);

    let response = getSomethingElseResponse(sessionId, currentOption);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getCurrentOption(req, contexts) {
    return getParameterFromContexts(contexts, SOMETHING_ELSE_CONTEXT, SOMETHING_ELSE_OPTION_CURRENT);
}

function getSomethingElseResponse(sessionId, currentOption) {
    let fulfillmentText = getSomethingElseFulfillmentText(currentOption);
    let outputContexts = getSomethingElseOutputContexts(sessionId, currentOption);
    return {
        fulfillmentText,
        outputContexts,
    };
}

function getSomethingElseFulfillmentText(currentOption) {
    let fulfillmentText = "";
    if (currentOption === "") {
        // NOTE: first instance of something else intent
        fulfillmentText = "Do you want to know the monthly payment for a loan amount? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT) {
        fulfillmentText = "Do you want to know how much you can borrow? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_LOAN_AMOUNT) {
        fulfillmentText = "Do you want to know the monthly payment for a loan amount? Or something else?";
    }
    return fulfillmentText;
}

function getSomethingElseOutputContexts(sessionId, currentOption) {
    let somethingElseOutputContext = getSomethingElseOutputContext(sessionId, 5, currentOption);
    return [somethingElseOutputContext];
}

function getSomethingElseOutputContext(sessionId, lifespanCount, currentOption) {
    let newCurrentOption = getNewCurrentOption(currentOption);
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + SOMETHING_ELSE_CONTEXT,
        lifespanCount,
        "parameters": {
            "currentOption": newCurrentOption,
        }
    };
}

function getNewCurrentOption(currentOption) {
    let newCurrentOption = "";
    if (currentOption === "") {
        // NOTE: first instance of something else intent
        newCurrentOption = SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT;
    } else if (currentOption === SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT) {
        newCurrentOption = SOMETHING_ELSE_OPTION_LOAN_AMOUNT;
    } else if (currentOption === SOMETHING_ELSE_OPTION_LOAN_AMOUNT) {
        newCurrentOption = SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT;
    }
    return newCurrentOption;
}

/*
 *
 * Utility Methods
 *
 */

function getParameterFromContexts(contexts, contextName, parameterName) {
    let parameter = "";
    let inputContext = getInputContext(contexts, contextName);
    if (inputContext && inputContext.parameters && inputContext.parameters[parameterName]) {
        parameter = inputContext.parameters[parameterName];
    }
    return parameter;
}

function getInputContext(contexts, contextName) {
    return contexts.filter(context => {
        return getContextName(context) === contextName;
    })[0];
}

function getContextName(context) {
    return context.name.split("/").pop();
}