let currentRuleAST = null; 

function handleCreateRuleResponse(response) {
    if (response.ruleAST) {
        currentRuleAST = response.ruleAST; 
        console.log('Rule AST stored successfully:', currentRuleAST);
    }
}

function createRule() {
    const ruleString = document.getElementById('ruleString').value;
    
    fetch('/api/rules/create_rule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rule_string: ruleString
        })
    })
    .then(response => response.json())
    .then(result => {
        handleCreateRuleResponse(result);
        document.getElementById('create-rule-result').textContent = 'Rule created successfully!';
        document.getElementById('ast-display').textContent = JSON.stringify(result.ruleAST, null, 2);
    })
    .catch(error => {
        console.error('Error creating rule:', error);
    });
}

async function combineRules() {
    const rulesInput = document.getElementById('rules').value.trim();
    const operator = document.getElementById('operator').value;

    const rulesArray = rulesInput.split('\n').filter(rule => rule.trim() !== '');

    if (rulesArray.length === 0) {
        document.getElementById('result').innerText = 'No rules to combine.';
        return;
    }

    try {
        const response = await fetch('/api/rules/combine_rules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rules: rulesArray,
                operator: operator,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            currentRuleAST = result.combinedAST;
            document.getElementById('result').innerText = 'Combined AST: ' + JSON.stringify(currentRuleAST, null, 2);
        } else {
            document.getElementById('result').innerText = 'Error: ' + result.error;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error combining rules';
    }
}

function evaluateRule() {
    const evaluationDataInput = document.getElementById('evaluationData').value;

    let data;
    try {
        data = JSON.parse(evaluationDataInput);
    } catch (error) {
        document.getElementById('evaluate-rule-result').textContent = 'Invalid JSON format. Please provide valid JSON data.';
        console.error('Error parsing input:', error);
        return;
    }

    if (!currentRuleAST) {
        document.getElementById('evaluate-rule-result').textContent = 'No rule AST available. Please create a rule first.';
        return;
    }

    const evaluationResult = evaluate(currentRuleAST, data);

    document.getElementById('evaluate-rule-result').textContent = `Evaluation Result: ${evaluationResult ? 'True' : 'False'}`;
}

function evaluate(ruleAST, data) {
    if (!ruleAST || !data) {
        console.log("Invalid ruleAST or data provided.");
        return false;
    }

    switch (ruleAST.type) {
        case 'operator':
            if (ruleAST.operator === 'AND') {
                console.log('Evaluating AND operator with left and right:');
                return evaluate(ruleAST.left, data) && evaluate(ruleAST.right, data);
            } else if (ruleAST.operator === 'OR') {
                console.log('Evaluating OR operator with left and right:');
                return evaluate(ruleAST.left, data) || evaluate(ruleAST.right, data);
            }
            break;
        case 'condition':
            const { field, operator, value } = ruleAST;
            const dataValue = data[field];

            console.log(`Evaluating condition: ${field} ${operator} ${value}`);
            console.log(`Data value: ${dataValue}`);

            if (typeof dataValue === 'undefined') {
                console.log(`Data does not contain the field: ${field}`);
                return false;
            }

            switch (operator) {
                case '>':
                    return parseFloat(dataValue) > parseFloat(value);
                case '<':
                    return parseFloat(dataValue) < parseFloat(value);
                case '=':
                    return dataValue === value;
            }
            break;
    }
    return false; 
}

document.getElementById('combine-rule-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const rulesInput = document.getElementById('rules').value.trim();
    const rulesArray = rulesInput.split('\n').filter(rule => rule.trim() !== '');

    try {
        const response = await fetch('/api/rules/combine_rules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rules: rulesArray,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            currentRuleAST = result.combinedAST; 
            document.getElementById('result').innerText = ''; 
            document.getElementById('ast-display').textContent = 'Combined AST: ' + JSON.stringify(result.combinedAST, null, 2); 
        } else {
            document.getElementById('result').innerText = 'Error: ' + result.error;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error combining rules';
    }
});
