import fs from "fs";

export function create_sitemap(files) {
    // separated into two maps because I don't know if the second one will be used
    let sitemap = {};

    for (const [key, value] of files) {
        if (value.extension == "md") {
            sitemap[key] = value.path.slice(0, -2) + "html";
        }
        else {
            sitemap[`/${key}`] = value.path + ".html";
        }
    }

    fs.writeFileSync("./build/static/navigation.json", JSON.stringify(sitemap));
}

// WIP function for graphs on pages
export function create_graph_map(files) {
    let nodes = {};
    let connections = {};
    let ids = {};

    let i = 1;

    for (const [key, _] of files) {
        ids[key] = i;
        i++;
    }

    for (const [key, value] of files) {
        if (value.extension == "md") {
            nodes[ids[key]] = {
                label: key,
                link: value.path.slice(0, -2) + "html",
            }

            if (connections[ids[key]] === undefined) {
                connections[ids[key]] = [];
            }

            const regex = /\[\[(.*?)\]\]/g;
            const matches = [...value.content.matchAll(regex)];

            for (let match of matches) {
                if (ids[match[1]] === undefined) {
                    continue;
                }

                connections[ids[key]].push(ids[match[1]]);
            }
        }
        else {
            nodes[i.toString()] = {
                label: key,
                link: value.path + ".html",
            };

            ids[key] = i.toString();
        }
    }

    let graph = {
        nodes: nodes,
        edges: connections,
    }

    fs.writeFileSync("./build/static/graph.json", JSON.stringify(graph));
}
