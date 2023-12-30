import { Marked } from "marked";
import { markedSmartypants } from "marked-smartypants";
import markedKatex from "marked-katex-extension";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

function parse_links(text, files, path) {
    const regex = /\[\[(.*?)\]\]/g;

    const matches = [...text.matchAll(regex)];

    for (let match of matches) {
        // ignore if link not found
        if (files.get(match[1]) === undefined) {
            text = text.replace(match[0], match[1]);
            continue;
        }
        text = text.replace(
            match[0],
            `[${match[1]}](/digital-garden/${files.get(match[1]).path.slice(0, -2) + "html"})`,
        )
    }

    return text;
}

export function compile_markdown(text, files, path) {
    text = parse_links(text, files, path);

    const marked = new Marked();

    marked.use({
        async: false,
        gfm: true,
        pedantic: false,
    });

    marked.use(markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        }
    }));

    marked.use(markedKatex({
        throwOnError: true,
    }));

    marked.use(markedSmartypants());

    return marked.parse(text).toString();
}
