import hljs from "highlight.js";
import fs from "fs";

function fill_other_template(filename, content, extension) {
    const code_extensions = ["js", "el"]

    if (code_extensions.indexOf(extension) > -1) {
        const template = fs.readFileSync("./src/web/views/code.html", "utf-8");

        let html = template.replace(/{{title}}/, filename);
        html = html.replace(/{{content}}/, content);
        html = html.replace(/{{filename}}/, filename);

        return html;
    }
}

export function build_other(key, value) {
    const dir = "./build/" + value.path.split("/").slice(0, -1).join("/");

    fs.mkdirSync(dir, { recursive: true }, _ => {});

    const path = "./build/" + value.path + ".html";

    const highlight = hljs.highlightAuto(value.content).value;

    fs.writeFileSync(path, fill_other_template(key, highlight, value.extension));
}
