/**
 * 字符串数组合并
 */
export function mergeStringArr(...args: string[][]) {
    const set = new Set([''].concat.apply([], args));
    return [...set];
}

/**
 * 将Json文件中的内容转成对象
 */
export function parseJsonFileContent(jsonText: string) {
    return JSON.parse(JSON.stringify(eval("(" + jsonText + ")")));
}

const defaultScopes = ['javascript', 'typescript', 'vue', 'javascriptreact', 'typescriptreact', 'html'];

/**
 * 解析支持的语言列表
 * @param scope 配置的支持的语言列表
 */
export function parseScope(scope: string) {
    return (scope && scope.trim() !== '*') ? scope.split(',') : defaultScopes;
}

/**
 * 判断关键词是否包含在在prefix中
 * @param prefix 前缀
 * @param word 关键词
 * @param lower 忽略大小写
 */
export function matchPrefix(prefix: string, word: string, lower = true) {
    if (lower) {
        prefix = prefix.toLocaleLowerCase();
        word = word.toLocaleLowerCase();
    }
    let i = 0, j = 0;
    while (i < prefix.length && j < prefix.length) {
        const pChar = prefix[i];
        const wChar = word[j];
        if (pChar === wChar) {
            i++;
            j++;
        } else {
            i++;
        }
    }
    return !!prefix && !!word && j === word.length;
}