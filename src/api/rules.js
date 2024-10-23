const express = require('express');
const router = express.Router();
const { createRuleAST, combineRules, evaluateRule } = require('../utils/astHelper');
const fs = require('fs');
const path = require('path');

 const ruleDb = path.join(__dirname, '../db/rules.json');

function loadRules() {
    if (!fs.existsSync(ruleDb)) {
        fs.writeFileSync(ruleDb, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(ruleDb, 'utf8'));
}

function saveRules(rules) {
    fs.writeFileSync(ruleDb, JSON.stringify(rules, null, 2));
}

router.post('/create_rule', (req, res) => {
    const { rule_string } = req.body;
    try {
        const ruleAST = createRuleAST(rule_string);
        let rules = loadRules();
        rules.push(ruleAST);
        saveRules(rules);
        res.json({ message: 'Rule created successfully', ruleAST });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/combine_rules', (req, res) => {
    const { rules } = req.body;
    try {
        const combinedAST = combineRules(rules.map(createRuleAST));
        let rulesData = loadRules();
        rulesData.push(combinedAST); 
        saveRules(rulesData); 

        res.json({ combinedAST });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/evaluate_rule', (req, res) => {
    const { ruleAST, data } = req.body;
    try {
        if (!ruleAST) {
            throw new Error('Rule AST is undefined');
        }
        const result = evaluateRule(ruleAST, data);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/list_rules', (req, res) => {
    try {
        const rules = loadRules();
        res.json({ rules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete_all_rules', (req, res) => {
    try {
        saveRules([]);
        res.json({ message: 'All rules have been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
