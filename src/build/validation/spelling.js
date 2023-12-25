import fs from "fs"

// I need to do this require garbage because if I just use import it throws an error
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Nodehun = require("nodehun");

function find_word_position(text, target_word) {
    const lines = text.split('\n');

    let line_index = -1;
    let column_index = -1;

    for (let i = 0; i < lines.length; i++) {
        const word_index = lines[i].indexOf(target_word);

        if (word_index !== -1) {
            line_index = i + 1; // Lines are usually 1-based
            column_index = word_index + 1; // Columns are usually 1-based
            break;
        }
    }

    return { line: line_index, column: column_index };
}

function prepare_nodehun() {
    const affix = fs.readFileSync("./src/build/validation/en_GB.aff");
    const dictionary = fs.readFileSync("./src/build/validation/en_GB.dic");
    
    const nodehun = new Nodehun(affix, dictionary);

    nodehun.addSync("md");

    return nodehun;
}

function prepare_for_spell_checking(text) {
    const code_block_regex = /```[\s\S]*?```/g;
    const inline_code_regex = /`.*?`/g;
    text = text.replace(code_block_regex, '').replace(inline_code_regex, '');

    // Remove HTML tags
    text = text.replace(/<.*?>/g, '');

    // Remove other Markdown elements (e.g., headers, lists, links)
    text = text.replace(/^[=-]+\s*$/gm, '');  // Remove underlines
    text = text.replace(/^#{1,6}\s+/gm, '');   // Remove headers
    text = text.replace(/^(\*|\+|-)\s+/gm, '');  // Remove list items
    text = text.replace(/\[.*?\]\(.*?\)/g, '');  // Remove links

    // Replace special characters and digits with spaces
    text = text.replace(/[^A-Za-z\s]/g, ' ');

    return text;
}

export function validate_spelling(text, file) {
    const prepped_text = prepare_for_spell_checking(text);

    const nodehun = prepare_nodehun();

    const words = prepped_text.split(/[\n\t\s\/]+/);

    for (let word of words) {
        if (!nodehun.spellSync(word)) {
            const position = find_word_position(text, word)

            console.log(`\x1b[1;35mSpelling Error\x1b[0m (${file} ${position.line}:${position.column}):\n\tword: ${word}\n\tsuggestions: ${nodehun.suggestSync(word)}\n`);
        }
    }
}