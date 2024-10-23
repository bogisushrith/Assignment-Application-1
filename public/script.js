const API_URL = 'http://localhost:3000/api/rules';

async function createRule() {
    const ruleString = document.getElementById('ruleString').value;
    const response = await fetch(`${API_URL}/create_rule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rule_string: ruleString }),
    });

    const resultDiv = document.getElementById('create-rule-result');
    const result = await response.json();
    resultDiv.innerText = JSON.stringify(result, null, 2);
}

async function combineRules() {
    const rulesList = document.getElementById('rulesList').value.split(',');
    const response = await fetch(`${API_URL}/combine_rules`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules: rulesList.map(rule => rule.trim()) }),
    });

    const resultDiv = document.getElementById('combine-rules-result');
    const result = await response.json();
    resultDiv.innerText = JSON.stringify(result, null, 2);
}

async function evaluateRule() {
    const evaluationDataString = document.getElementById('evaluationData').value;
    let evaluationData;
    
    try {
        evaluationData = JSON.parse(evaluationDataString);
    } catch (error) {
        console.error('Invalid JSON input for evaluation:', error);
        document.getElementById('evaluateRuleResult').textContent = 'Invalid input format. Please provide valid JSON.';
        return;
    }

    fetch('/api/rules/evaluate_rule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ruleAST: evaluationData.ruleAST,
            data: evaluationData.data  
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Evaluation result:', result);
        document.getElementById('evaluateRuleResult').textContent = `Result: ${result.result}`;
    })
    .catch(error => {
        console.error('Error evaluating rule:', error);
    });
}


