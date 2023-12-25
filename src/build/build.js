import fs from "fs";

import { compile_markdown } from "./compiler.js";
import { generate_file_map } from "./crawler.js";
import { create_sitemap } from "./navigation.js";
import { build_other } from "./other.js";

export function clean() {
    fs.rmSync("./build", { recursive: true, force: true });
}

function copy_lib_static() {
    fs.cpSync("./src/web/lib", "./build/lib/", { recursive: true });
    fs.cpSync("./src/web/static", "./build/static/", { recursive: true });
}

function fill_template(content, title) {
    const template = fs.readFileSync("./src/web/views/post.html", "utf-8");

    let html = template.replace(/{{title}}/, title);
    html = html.replace(/{{content}}/, content);

    return html;
}

function build_markdown(key, value, files, preprocessors, transformers) {
    for (preprocessor of preprocessors) {
        value.content = preprocessor(value.content);
    }

    let html = compile_markdown(value.content, files, "./build");
    for (transformer of transformers) {
        html = transfromer(html);
    }

    const dir = "./build/" + value.path.split("/").slice(0, -1).join("/");

    fs.mkdirSync(dir, { recursive: true }, _ => {});

    const path = "./build/" + value.path.slice(0, -2) + "html";

    fs.writeFileSync(path, fill_template(html, key));
}

export function build(preprocessors, transformers) {
    let files = generate_file_map("./content");

    fs.mkdirSync("./build/");

    copy_lib_static();

    for (const [key, value] of files) {
        if (value.extension == "md") {
            build_markdown(key, value, files, preprocessors, transformers);
        }
        else {
            build_other(key, value);
        }
    }

    create_sitemap(files);
}
