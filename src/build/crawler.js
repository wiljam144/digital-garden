import fs from "fs";
import path from "path";

function traverse_directory(dir, files) {
    fs.readdirSync(dir).forEach(file => {
        const absolute = path.join(dir, file);

        if (fs.statSync(absolute).isDirectory()) {
            traverse_directory(absolute, files)
        }
        else {
            files.push(absolute);
        }
    });
}

export function generate_file_map(dir) {
    let files_list = [];

    traverse_directory(dir, files_list);

    const files = new Map();

    files_list.forEach(file => {
        if (file.includes("private") || file.includes(".obsidian")) {
            return;
        }

        // if dir includes "/" the slice changes
        // this accounts for that
        let n = 1;
        if (dir[dir.length - 1] == '/') {
            n = 2;
        }

        const content = fs.readFileSync(file).toString();

        if (file.slice(-2) != "md") {
            files.set(file.slice(dir.length - n), {
                // this should be probably removed in the future, since it will really quickly fill up memory.
                content: content,
                path: file.slice(dir.length - n),
                extension: file.split(".").at(-1),
            });

            return;
        }

        const regex = /# (.*?)(?:\n|$)/
        const title = regex.exec(content)[1];

        files.set(title, {
            content: content,
            path: file.slice(dir.length - n),
            extension: file.split(".").at(-1),
        });
    });

    return files;
}
