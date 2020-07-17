
const fs = require('fs');
const path = require('path');

function transferFileDataToSnippetBody(fileName) {
    let text = fs.readFileSync(path.resolve(__dirname, fileName), {
        encoding: 'utf-8'
    });
    text = text.replace(/\"/g, "\\\"").split('\n').map(v => `"${v}"`).join(",");
    return `[${text}]`;
}

export default{
    transferFileDataToSnippetBody
};