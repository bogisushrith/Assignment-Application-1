const express = require('express');
const bodyParser = require('body-parser');
const rulesApi = require('./src/api/rules');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/rules', rulesApi);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function createRuleAST(ruleString) {
    const parts = ruleString.replace(/"/g, '').split(' ');
    if (parts.length === 3) {
        return {
            type: 'condition',
            field: parts[0],
            operator: parts[1],
            value: parts[2]
        };
    } else {
        throw new Error('Invalid rule format');
    }
}

function combineRules(asts, operator) {
    if (asts.length === 0) {
        throw new Error('No ASTs provided to combine.');
    }

    let combinedAST = asts[0];
    for (let i = 1; i < asts.length; i++) {
        combinedAST = {
            type: 'operator',
            operator: operator,
            left: combinedAST,
            right: asts[i]
        };
    }

    return combinedAST;
}

app.post('/combine-rules', (req, res) => {
    const { rules, operator } = req.body;

    try {
        const asts = rules.map(rule => createRuleAST(rule));
        const combinedAST = combineRules(asts, operator);
        res.json(combinedAST);
    } catch (error) {
        console.error('Error combining rules:', error.message);
        res.status(500).json({ error: error.message });
    }
});
