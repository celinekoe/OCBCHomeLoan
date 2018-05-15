
const CALCULATE_LOAN_INTENT = "CalculateLoan";
const SET_PROPERTY_TYPE_INTENT = "SetPropertyType";
const SET_AGE_INTENT = "SetAge";
const SET_MONTHLY_INCOME_INTENT = "SetMonthlyIncome";
const SET_MONTHLY_DEBT_INTENT = "SetMonthlyDebt";
const SET_REPAYMENT_PERIOD_INTENT = "SetRepaymentPeriod";
const CALCULATE_MONTHLY_PAYMENT_FOR_INDICATIVE_LOAN_AMOUNT_INTENT = "CalculateMonthlyPaymentForIndicativeLoanAmount";
const CALCULATE_MONTHLY_PAYMENT = "CalculateMonthlyPayment";
const SOMETHING_ELSE_INTENT = "SomethingElse";
const DEFAULT_FALLBACK_INTENT = "Sorry, I don't know what you mean.";

const CALCULATE_LOAN_CONTEXT = "calculateloan";
const SOMETHING_ELSE_CONTEXT = "somethingelse";

const PROPERTY_TYPE_PROPERTY = "propertyType";
const AGE_PROPERTY = "age";
const MONTHLY_INCOME_PROPERTY = "monthlyIncome";
const MONTHLY_DEBT_PROPERTY = "monthlyDebt";
const REPAYMENT_PERIOD_PROPERTY = "repaymentPeriod";
const INDICATIVE_LOAN_AMOUNT_PROPERTY = "indicativeLoanAmount";

const PROPERTY_TYPE_PUBLIC = "public";
const PROPERTY_TYPE_PRIVATE = "private";

const MAX_MORTGAGECOMPARISON_SERVICING_RATIO = 0.3; 
const MAX_TOTAL_DEBT_SERVICING_RATIO = 0.6;

const SOMETHING_ELSE_OPTION_CURRENT = "currentOption";
const SOMETHING_ELSE_OPTION_LOAN_AMOUNT = "loanAmount";
const SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT = "monthlyPayment";

const YEAR_ONE_INTEREST_RATE = 0.015;
const YEAR_TWO_INTEREST_RATE = 0.015;
const YEAR_THREE_INTEREST_RATE = 0.02;
const THEREAFTER_INTEREST_RATE = 0.025;

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
    } else if (intent === CALCULATE_MONTHLY_PAYMENT_FOR_INDICATIVE_LOAN_AMOUNT_INTENT) {
        calculateMonthlyPaymentForIndicativeLoanAmount(req, res);
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
    let sessionId = getSessionId(req);
    let contexts = getContexts(req);
    let parameters = getCalculateLoanParameters(req, contexts);

    let response = getRepaymentPeriodResponse(sessionId, parameters);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getRepaymentPeriodResponse(sessionId, parameters) {
    let indicativeLoanAmount = getIndicativeLoanAmount(parameters);
    let newParameters = getNewParameters(parameters, indicativeLoanAmount);
    let outputContexts = getRepaymentPeriodOutputContexts(sessionId, newParameters);
    return {
        "fulfillmentText": "Your indicative loan amount is " + indicativeLoanAmount + ". Would you like to know your monthly payment? Or something else?",
        outputContexts,
    };
}

function getNewParameters(parameters, indicativeLoanAmount) {
    let newParameters = parameters;
    newParameters[AGE_PROPERTY] = { 
        "amount": parameters[AGE_PROPERTY],
        "unit": "year",
    };
    newParameters[REPAYMENT_PERIOD_PROPERTY] = {
        "amount": parameters[REPAYMENT_PERIOD_PROPERTY],
        "unit": "year",
    }
    newParameters[INDICATIVE_LOAN_AMOUNT_PROPERTY] = indicativeLoanAmount;
    return newParameters;
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

function getRepaymentPeriodOutputContexts(sessionId, parameters) {
    repaymentPeriodOutputContext = getRepaymentPeriodOutputContext(sessionId, 5, parameters);
    return [repaymentPeriodOutputContext];
}

function getRepaymentPeriodOutputContext(sessionId, lifespanCount, parameters) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + CALCULATE_LOAN_CONTEXT,
        lifespanCount,
        parameters,
    };
}

/*
 *
 * Calculate Monthly Payment For Indicative Loan Amount
 *
 */

function calculateMonthlyPaymentForIndicativeLoanAmount(req, res) {
    let contexts = getContexts(req);
    let parameters = getCalculateLoanParameters(req, contexts);

    let response = getMonthlyPaymentForIndicativeLoanAmountResponse(parameters);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getMonthlyPaymentForIndicativeLoanAmountResponse(parameters) {
    let monthlyPayment = getMonthlyPaymentForIndicativeLoanAmount(parameters);
    return {
        "fulfillmentText": "Your monthly payment is " + monthlyPayment,
    };
}

function getMonthlyPaymentForIndicativeLoanAmount(parameters) {
    // NOTE: payment formula - https://money.stackexchange.com/questions/61639/what-is-the-formula-for-the-monthly-payment-on-an-adjustable-rate-mortgage
    let L = parameters.indicativeLoanAmount; // loan amount
    let c = YEAR_ONE_INTEREST_RATE / 12; // monthly interest rate
    let n = parameters.repaymentPeriod * 12; // repayment period in months
    return Math.ceil(L * c * Math.pow(1 + c, n) / (Math.pow(1 + c, n) - 1)); // monthly payment
}

/*
 *
 * Get Parameters
 *
 */

function getCalculateLoanParameters(req, contexts) {
    let propertyType = getPropertyType(req, contexts);
    let age = getAge(req, contexts);
    let monthlyIncome = getMonthlyIncome(req, contexts);
    let monthlyDebt = getMonthlyDebt(req, contexts);
    let repaymentPeriod = getRepaymentPeriod(req, contexts);
    let indicativeLoanAmount = getIndicativeLoanAmountFromInputContext(req, contexts);
    return {
        propertyType,
        age,
        monthlyIncome,
        monthlyDebt,
        repaymentPeriod,
        indicativeLoanAmount,
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

function getIndicativeLoanAmountFromInputContext(req, contexts) {
    let indicativeLoanAmount = "";
    if (req.body.queryResult.parameters[INDICATIVE_LOAN_AMOUNT_PROPERTY]) {
        indicativeLoanAmount = req.body.queryResult.parameters[INDICATIVE_LOAN_AMOUNT_PROPERTY];
    } else {
        indicativeLoanAmount = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, INDICATIVE_LOAN_AMOUNT_PROPERTY);
    }
    return indicativeLoanAmount;
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
        fulfillmentText = "Would you like to know the monthly payment for a loan amount? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_MONTHLY_PAYMENT) {
        fulfillmentText = "Would you like to know how much you can borrow? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_LOAN_AMOUNT) {
        fulfillmentText = "Would you like to know the monthly payment for a loan amount? Or something else?";
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