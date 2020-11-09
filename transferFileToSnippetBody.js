// node transferFileToSnippetBody.js file1path file2path
const { argv } = process;
const fs = require('fs');
const path = require('path');
const files = argv.slice(2);

function transferFileDataToSnippetBody(fileName) {
    let text = fs.readFileSync(path.resolve(__dirname, fileName), {
        encoding: 'utf-8'
    });
    text = text.replace(/\"/g, "\\\"").split('\n').map(v => `"${v}"`).join(",");
    text = `[${text}]`;
    fs.writeFileSync(path.resolve(__dirname, fileName + ".json"), text);
}

for (const file of files) {
    try {
        transferFileDataToSnippetBody(file);
        console.log(`${file}转换成功`);
    } catch (err) {
        console.log(`${file}不存在`);
    }
}