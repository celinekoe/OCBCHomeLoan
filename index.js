
const CALCULATE_LOAN_INTENT = "CalculateLoan";
const SET_PROPERTY_TYPE_INTENT = "SetPropertyType";
const SET_AGE_INTENT = "SetAge";
const SET_MONTHLY_INCOME_INTENT = "SetMonthlyIncome";
const SET_MONTHLY_DEBT_INTENT = "SetMonthlyDebt";
const SET_REPAYMENT_PERIOD_FOR_CALCULATE_LOAN_INTENT = "SetRepaymentPeriodForCalculateLoan";
const CALCULATE_MONTHLY_PAYMENT = "CalculateMonthlyPayment";
const SET_REPAYMENT_PERIOD_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT = "SetRepaymentPeriodForCalculateMonthlyPayment";
const SET_LOAN_AMOUNT_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT = "SetLoanAmountForCalculateMonthlyPayment";

const SOMETHING_ELSE_FOR_WELCOME_INTENT = "SomethingElseForWelcome";
const SOMETHING_ELSE_FOR_CALCULATE_LOAN_INTENT = "SomethingElseForCalculateLoan";
const SOMETHING_ELSE_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT = "SomethingElseForCalculateMonthlyPayment";
const SOMETHING_ELSE_INTENT = "SomethingElse";
const DEFAULT_FALLBACK_INTENT = "Sorry, I don't know what you mean.";

const CALCULATE_LOAN_CONTEXT = "calculateloan";
const SET_MONTHLY_DEBT_CONTEXT = "setmonthlydebt";
const SET_REPAYMENT_PERIOD_FOR_CALCULATE_LOAN_CONTEXT = "setrepaymentperiodforcalculateloan";
const CALCULATE_MONTHLY_PAYMENT_CONTEXT = "calculatemonthlypayment";
const SOMETHING_ELSE_CONTEXT = "somethingelse";

const PROPERTY_TYPE_PROPERTY = "propertyType";
const AGE_PROPERTY = "age";
const MONTHLY_INCOME_PROPERTY = "monthlyIncome";
const MONTHLY_DEBT_PROPERTY = "monthlyDebt";
const REPAYMENT_PERIOD_PROPERTY = "repaymentPeriod";
const LOAN_AMOUNT_PROPERTY = "loanAmount";

const PROPERTY_TYPE_PUBLIC = "public";
const PROPERTY_TYPE_PRIVATE = "private";

const MAX_MORTGAGECOMPARISON_SERVICING_RATIO = 0.3; 
const MAX_TOTAL_DEBT_SERVICING_RATIO = 0.6;

const SOMETHING_ELSE_OPTION_CURRENT = "currentOption";
const SOMETHING_ELSE_OPTION_CALCULATE_LOAN = "loanAmount";
const SOMETHING_ELSE_OPTION_CALCULATE_LOAN_VARIANT = "loanAmountVariant";
const SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT = "monthlyPayment";

const YEAR_ONE = "first year";
const YEAR_ONE_INTEREST_RATE = 0.015;
const YEAR_TWO = "second year";
const YEAR_TWO_INTEREST_RATE = 0.015;
const YEAR_THREE = "third year";
const YEAR_THREE_INTEREST_RATE = 0.02;
const THEREAFTER = "Thereafter";
const THEREAFTER_INTEREST_RATE = 0.025;

const ONE_PERCENT = "one percent";
const ONE_PERCENT_INTEREST_RATE = 0.01;
const ONE_POINT_FIVE_PERCENT = "one point five percent";
const ONE_POINT_FIVE_PERCENT_INTEREST_RATE = 0.015;
const TWO_PERCENT = "two percent";
const TWO_PERCENT_INTEREST_RATE = 0.02;
const TWO_POINT_FIVE_PERCENT = "two point five percent";
const TWO_POINT_FIVE_PERCENT_INTEREST_RATE = 0.025;

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
    } else if (intent === SET_REPAYMENT_PERIOD_FOR_CALCULATE_LOAN_INTENT) {
        setRepaymentPeriodForCalculateLoan(req, res);
    } else if (intent === CALCULATE_MONTHLY_PAYMENT) {
        calculateMonthlyPayment(res);
    } else if (intent === SET_REPAYMENT_PERIOD_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT) {
        setRepaymentPeriodForCalculateMonthlyPayment(res);
    } else if (intent === SET_LOAN_AMOUNT_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT) {
        setLoanAmountForCalculateMonthlyPayment(req, res);
    } else if (intent === SOMETHING_ELSE_FOR_WELCOME_INTENT) {
        somethingElseForCalculateLoan(req, res);
    } else if (intent === SOMETHING_ELSE_FOR_CALCULATE_LOAN_INTENT) {
        somethingElseForCalculateLoanVariant(req, res);
    } else if (intent === SOMETHING_ELSE_FOR_CALCULATE_MONTHLY_PAYMENT_INTENT) {
        somethingElseForCalculateMonthlyPayment(req, res);
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

function setRepaymentPeriodForCalculateLoan(req, res) {
    let sessionId = getSessionId(req);
    let contexts = getContexts(req);
    let parameters = getLoanParameters(req, contexts);
    if (parameters[REPAYMENT_PERIOD_PROPERTY] >= 5 && parameters[REPAYMENT_PERIOD_PROPERTY] <= 35) {
        let response = getRepaymentPeriodForCalculateLoanResponse(sessionId, parameters);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    } else {
        let response = getInvalidRepaymentPeriodForCalculateLoanResponse(sessionId, parameters);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    }
}

function getRepaymentPeriodForCalculateLoanResponse(sessionId, parameters) {
    let fulfillmentText = getRepaymentPeriodForCalculateLoanFulfillmentText(parameters);
    let outputContexts = getRepaymentPeriodForCalculateLoanOutputContexts(sessionId, parameters);
    return {
        fulfillmentText,
        outputContexts,
    };
}

function getRepaymentPeriodForCalculateLoanOutputContexts(sessionId, parameters) {
    let monthlyDebtOutputContext = getContextToRemove(sessionId, SET_MONTHLY_DEBT_CONTEXT);
    let calculateLoanOutputContext = getContextWithParameters(sessionId, 5, parameters, CALCULATE_LOAN_CONTEXT);
    let repaymentPeriodForCalculateLoanOutputContext = getContextWithParameters(sessionId, 5, parameters, SET_REPAYMENT_PERIOD_FOR_CALCULATE_LOAN_CONTEXT);
    return [monthlyDebtOutputContext, calculateLoanOutputContext, repaymentPeriodForCalculateLoanOutputContext];
}

function getRepaymentPeriodForCalculateLoanFulfillmentText(parameters) {
    let indicativeLoanAmount = getIndicativeLoanAmount(parameters);
    let monthlyPaymentAtOnePointFivePercent = calculateMonthlyPaymentForLoanAmount(indicativeLoanAmount, ONE_POINT_FIVE_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    let monthlyPaymentAtTwoPercent = calculateMonthlyPaymentForLoanAmount(indicativeLoanAmount, TWO_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    let monthlyPaymentAtTwoPointFivePercent = calculateMonthlyPaymentForLoanAmount(indicativeLoanAmount, TWO_POINT_FIVE_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    return "Your indicative loan amount is " + indicativeLoanAmount + ". " +
        "For the " + YEAR_ONE + ", your monthly payment will be " +  monthlyPaymentAtOnePointFivePercent + " at an interest rate of " + ONE_POINT_FIVE_PERCENT + ". " +
        "For the " + YEAR_TWO + ", it will be " +  monthlyPaymentAtOnePointFivePercent + " at " + ONE_POINT_FIVE_PERCENT + ". " +
        "For the " + YEAR_THREE + ", it will be " +  monthlyPaymentAtTwoPercent + " at " + TWO_PERCENT + ". " +
        THEREAFTER + ",  it will be " + monthlyPaymentAtTwoPointFivePercent + " at " + TWO_POINT_FIVE_PERCENT + ". " +
        "Would you like to know something else?";
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

function getInvalidRepaymentPeriodForCalculateLoanResponse(sessionId, parameters) {
    let outputContexts = getInvalidRepaymentPeriodForCalculateLoanOutputContexts(sessionId, parameters);
    return {
        "fulfillmentText": "Invalid repayment period. Please state a repayment period between five and thirty-five years.",
        outputContexts,
    };
}

function getInvalidRepaymentPeriodForCalculateLoanOutputContexts(sessionId, parameters) {
    let calculateLoanOutputContext = getContextWithParameters(sessionId, 5, parameters, CALCULATE_LOAN_CONTEXT);
    let monthlyDebtOutputContext = getContextWithParameters(sessionId, 5, parameters, SET_MONTHLY_DEBT_CONTEXT);
    return [calculateLoanOutputContext, monthlyDebtOutputContext];
}

/*
 *
 * Calculate Monthly Payment
 *
 */

function calculateMonthlyPayment(res) {
    let response = getMonthlyPaymentResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getMonthlyPaymentResponse() {
    return {
        "fulfillmentText": "What is your expected repayment period?",
    };
}

/*
 *
 * Set Repayment Period For Monthly Payment
 *
 */

function setRepaymentPeriodForCalculateMonthlyPayment(res) {
    let response = getRepaymentPeriodForCalculateMonthlyPaymentResponse();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getRepaymentPeriodForCalculateMonthlyPaymentResponse() {
    return {
        "fulfillmentText": "What is your expected loan amount?",
    };
}

/*
 *
 * Set Loan For Calculate Monthly Payment
 *
 */

function setLoanAmountForCalculateMonthlyPayment(req, res) {
    let contexts = getContexts(req);
    let parameters = getMonthlyPaymentParameters(req, contexts);

    let response = getLoanAmountForCalculateMonthlyPaymentResponse(parameters);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function getLoanAmountForCalculateMonthlyPaymentResponse(parameters) {
    let fulfillmentText = getMonthlyPaymentFulfilmentText(parameters);
    return {
        fulfillmentText,
    };
}

function getMonthlyPaymentFulfilmentText(parameters) {
    let monthlyPaymentAtOnePercent = calculateMonthlyPaymentForLoanAmount(parameters[LOAN_AMOUNT_PROPERTY], ONE_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    let monthlyPaymentAtOnePointFivePercent = calculateMonthlyPaymentForLoanAmount(parameters[LOAN_AMOUNT_PROPERTY], ONE_POINT_FIVE_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    let monthlyPaymentAtTwoPercent = calculateMonthlyPaymentForLoanAmount(parameters[LOAN_AMOUNT_PROPERTY], TWO_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    let monthlyPaymentAtTwoPointFivePercent = calculateMonthlyPaymentForLoanAmount(parameters[LOAN_AMOUNT_PROPERTY], TWO_POINT_FIVE_PERCENT_INTEREST_RATE, parameters[REPAYMENT_PERIOD_PROPERTY]);
    return "Your monthly payment for a loan amount of " + parameters[LOAN_AMOUNT_PROPERTY] +
        " will be " + monthlyPaymentAtOnePercent + " at an interest rate of " + ONE_PERCENT + ", " +
        monthlyPaymentAtOnePointFivePercent + " at " + ONE_POINT_FIVE_PERCENT + ", " +
        monthlyPaymentAtTwoPercent + " at " + TWO_PERCENT + ", and " +
        monthlyPaymentAtTwoPointFivePercent + " at " + TWO_POINT_FIVE_PERCENT + ". " +
        "Would you like to know something else?";
}

/*
 *
 * Something Else
 *
 */

function somethingElseForCalculateLoan(req, res) {
    let sessionId = getSessionId(req);

    let response = getSomethingElseResponse(sessionId, SOMETHING_ELSE_OPTION_CALCULATE_LOAN);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function somethingElseForCalculateLoanVariant(req, res) {
    let sessionId = getSessionId(req);

    let response = getSomethingElseResponse(sessionId, SOMETHING_ELSE_OPTION_CALCULATE_LOAN_VARIANT);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

function somethingElseForCalculateMonthlyPayment(req, res) {
    let sessionId = getSessionId(req);

    let response = getSomethingElseResponse(sessionId, SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
}

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
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT) {
        fulfillmentText = "Would you like to know how much you can borrow? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_LOAN) {
        fulfillmentText = "Would you like to know the monthly payment for a loan amount? Or something else?";
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_LOAN_VARIANT) {
        fulfillmentText = "Would you like to know the monthly payment for a different loan amount? Or something else?";
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
        newCurrentOption = SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT;
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT) {
        newCurrentOption = SOMETHING_ELSE_OPTION_CALCULATE_LOAN;
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_LOAN) {
        newCurrentOption = SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT;
    } else if (currentOption === SOMETHING_ELSE_OPTION_CALCULATE_LOAN_VARIANT) {
        newCurrentOption = SOMETHING_ELSE_OPTION_CALCULATE_MONTHLY_PAYMENT;
    }
    return newCurrentOption;
}

/*
 *
 * Get Parameters
 *
 */

function getLoanParameters(req, contexts) {
    let propertyType = getPropertyType(req, contexts);
    let age = getAge(req, contexts);
    let monthlyIncome = getMonthlyIncome(req, contexts);
    let monthlyDebt = getMonthlyDebt(req, contexts);
    let repaymentPeriod = getRepaymentPeriod(req, contexts);
    let loanAmount = getLoanAmount(req, contexts);
    return {
        propertyType,
        age,
        monthlyIncome,
        monthlyDebt,
        repaymentPeriod,
        loanAmount,
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

function getLoanAmount(req, contexts) {
    let loanAmount = "";
    if (req.body.queryResult.parameters[LOAN_AMOUNT_PROPERTY]) {
        loanAmount = req.body.queryResult.parameters[LOAN_AMOUNT_PROPERTY];
    } else {
        loanAmount = getParameterFromContexts(contexts, CALCULATE_LOAN_CONTEXT, LOAN_AMOUNT_PROPERTY);
    }
    return loanAmount;
}

function getMonthlyPaymentParameters(req, contexts) {
    let repaymentPeriod = getRepaymentPeriodForCalculateMonthlyPayment(req, contexts);
    let loanAmount = getLoanAmountCalculateMonthlyPayment(req, contexts);
    return {
        repaymentPeriod,
        loanAmount,
    };
}

function getRepaymentPeriodForCalculateMonthlyPayment(req, contexts) {
    let repaymentPeriod = "";
    if (req.body.queryResult.parameters[REPAYMENT_PERIOD_PROPERTY]) {
        repaymentPeriod = req.body.queryResult.parameters[REPAYMENT_PERIOD_PROPERTY].amount;
    } else {
        tempRepaymentPeriod = getParameterFromContexts(contexts, CALCULATE_MONTHLY_PAYMENT_CONTEXT, REPAYMENT_PERIOD_PROPERTY);
        // NOTE: return value might be empty string
        if (tempRepaymentPeriod.amount) {
            repaymentPeriod = tempRepaymentPeriod.amount;
        }
    } 
    return repaymentPeriod;
}

function getLoanAmountCalculateMonthlyPayment(req, contexts) {
    let loanAmount = "";
    if (req.body.queryResult.parameters[LOAN_AMOUNT_PROPERTY]) {
        loanAmount = req.body.queryResult.parameters[LOAN_AMOUNT_PROPERTY];
    } else {
        loanAmount = getParameterFromContexts(contexts, CALCULATE_MONTHLY_PAYMENT_CONTEXT, LOAN_AMOUNT_PROPERTY);
    }
    return loanAmount;
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

function getContextWithParameters(sessionId, lifespanCount, parameters, context) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + context,
        lifespanCount,
        parameters,
    };
}

function getContextToRemove(sessionId, context) {
    return {
        "name": "projects/ocbchomeloan-5344d/agent/sessions/" + sessionId + "/contexts/" + context,
        "lifespanCount": 0,
    };
}

function calculateMonthlyPaymentForLoanAmount(loanAmount, yearlyInterestRate, repaymentPeriodInYears) {
    // NOTE: payment formula - https://money.stackexchange.com/questions/61639/what-is-the-formula-for-the-monthly-payment-on-an-adjustable-rate-mortgage
    let L = loanAmount;
    let c = yearlyInterestRate / 12; // monthly interest rate
    let n = repaymentPeriodInYears * 12; // repayment period in months
    return Math.ceil(L * c * Math.pow(1 + c, n) / (Math.pow(1 + c, n) - 1)); // monthly payment
}