// Validation script, should be used locally only when pushing new notes to prod.
// painfully slow due to processing every word. 

import { generate_file_map } from "../crawler.js";

import { validate_links } from "./link.js";
import { validate_spelling } from "./spelling.js";
import { validate_grammar } from "./grammar.js";

/* grammar checking */

export async function validate() {
    const files = generate_file_map("./content");

    for (const [_, value] of files) {
        await validate_links(value.content, value.path);
        await validate_spelling(value.content, value.path);
        await validate_grammar(value.content, value.path);
    }

    console.log("Validation Complete!\n");
}

validate();