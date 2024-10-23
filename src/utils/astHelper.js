class Node {
    constructor(type, operator = null, field = null, value = null, left = null, right = null) {
        this.type = type; 
        this.operator = operator;
        this.field = field; 
        this.value = value; 
        this.left = left; 
        this.right = right; 
    }
}

function tokenize(rule) {
    return rule.match(/(\w+|\(|\)|>|<|=|AND|OR|'[^']*')/g);
}

function buildAST(tokens) {
    let index = 0;

    const parseExpression = () => {
        let node = parseTerm();

        while (index < tokens.length && tokens[index] === 'OR') {
            const operator = tokens[index++];
            const right = parseTerm();
            node = new Node('operator', operator, null, null, node, right);
        }

        return node;
    };

    const parseTerm = () => {
        let node = parseFactor();

        while (index < tokens.length && tokens[index] === 'AND') {
            const operator = tokens[index++];
            const right = parseFactor();
            node = new Node('operator', operator, null, null, node, right);
        }

        return node;
    };

    const parseFactor = () => {
        let token = tokens[index];

        if (token === '(') {
            index++; 
            let node = parseExpression();
            if (tokens[index] === ')') {
                index++; 
            } else {
                throw new Error("Missing closing parenthesis");
            }
            return node;
        }

        let field = tokens[index++];
        let operator = tokens[index++];
        let value = tokens[index++];
        if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
        }

        return new Node('condition', operator, field, value);
    };

    return parseExpression();
}

function createRuleAST(ruleString) {
    const tokens = tokenize(ruleString);
    if (!tokens) {
        throw new Error("Invalid rule string");
    }
    return buildAST(tokens);
}

function combineRules(asts, combineOperator = 'AND') {
    if (!asts || asts.length === 0) return null;
    if (asts.length === 1) return asts[0];

    return asts.reduce((combined, current) => {
        return new Node('operator', combineOperator, null, null, combined, current);
    });
}

function evaluateRule(ruleAST, data) {
    if (!ruleAST) {
        throw new Error('Rule AST is undefined');
    }

    console.log('Evaluating Rule AST:', JSON.stringify(ruleAST, null, 2));
    console.log('With Data:', data);

    if (ruleAST.type === 'condition') {
        const { field, operator, value } = ruleAST;
        const actualValue = data[field];

        switch (operator) {
            case '>':
                return actualValue > Number(value);
            case '<':
                return actualValue < Number(value);
            case '=':
                return actualValue === value.replace(/'/g, ""); 
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    } else if (ruleAST.type === 'operator') {
        const leftResult = evaluateRule(ruleAST.left, data);
        const rightResult = evaluateRule(ruleAST.right, data);

        switch (ruleAST.operator) {
            case 'AND':
                return leftResult && rightResult;
            case 'OR':
                return leftResult || rightResult;
            default:
                throw new Error(`Unknown operator: ${ruleAST.operator}`);
        }
    } else {
        throw new Error(`Unknown AST node type: ${ruleAST.type}`);
    }
}

module.exports = {
    Node,
    createRuleAST,
    combineRules,
    evaluateRule
};
