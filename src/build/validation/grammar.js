import writeGood from "write-good";

function prepare_markdown_for_grammar_check(markdown_text) {
    // Remove headers (lines starting with #)
    markdown_text = markdown_text.replace(/^(#+)\s+(.*)$/gm, '$2');

    // Remove emphasis (italic and bold)
    markdown_text = markdown_text.replace(/(?:\*|_){1,2}(.*?)(?:\*|_){1,2}/g, '$1');

    // Remove code blocks (lines between ``` and ```)
    markdown_text = markdown_text.replace(/```[\s\S]*?```/g, '');

    // Remove inline code (between backticks)
    markdown_text = markdown_text.replace(/`([^`]+)`/g, '$1');

    // Remove links
    markdown_text = markdown_text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

    // Remove wikilinks
    markdown_text = markdown_text.replace(/\[\[([^\]]+)\]\]/g, '$1');

    // Remove images
    markdown_text = markdown_text.replace(/!\[.*?\]\(.*?\)/g, '');

    // Remove lists
    markdown_text = markdown_text.replace(/^(\s*[\d-]+\.\s*|\s*[-*]\s*)/gm, '');

    // Remove checkboxes
    markdown_text = markdown_text.replace(/\[(\s*|[xX])\]/g, '');

    return markdown_text;
}

export function validate_grammar(text, file) {
    const prepped_text = prepare_markdown_for_grammar_check(text);
    const sentences = prepped_text.split(/[\n.]/);

    let suggestions = [];
    for (const sentence of sentences) {
        const suggestion = writeGood(sentence + ".", { passive: false })
        suggestions = suggestions.concat(suggestion);
    }

    for (const suggestion of suggestions) {
        console.log(`\x1b[1;34mGrammar Suggestion\x1b[0m (${file}):\n\treason: ${suggestion.reason}\n`)
    }
}