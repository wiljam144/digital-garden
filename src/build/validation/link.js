async function is_link_dead(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        
        if (response.ok || (response.status >= 300 && response.status < 400)) {
            return false;
        } 
        else {
            return true;
        }
    } 
    catch (error) {
        return true;
    }
}

function get_position(text, index) {
    const lines = text.substring(0, index).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
}

function find_markdown_links(text) {
    const markdown_link_regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
    const links = [];
  
    let match;
    while ((match = markdown_link_regex.exec(text)) !== null) {
        const link_text = match[1];
        const link_url = match[2];

        const position = get_position(text, match.index);
    
        links.push({ text: link_text, url: link_url, position});
    }
  
    return links;
}

export function validate_links(text, file) {
    const links = find_markdown_links(text);

    for (const link of links) {
        is_link_dead(link.url).then(result => {
            if (result) {
                console.log(`\x1b[1;31mDead Link\x1b[0m (${file} ${link.position.line}:${link.position.column}):\n\ttext: ${link.text}\n\turl: ${link.url}\n`);
            }
        })
    }
}