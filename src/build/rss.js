import fs from "fs";

function convert_to_iso_date(str) {
    const month_map = {
        'January': '01',
        'February': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'August': '08',
        'September': '09',
        'October': '10',
        'November': '11',
        'December': '12'
    };

    const [month, year] = str.split(" ");
    const month_num = month_map[month];

    const iso_date_string = `${year}-${month_num}-01T00:00:00.000Z`;

    return iso_date_string;
}

function get_changelog() {
    let content = fs.readFileSync("./content/changelog.md", "utf-8");
    const result = [];

    const regex = /^##\s(.+?)\s*\n((?:\s*-\s*.+\n)+)/gm;

    let match;
    while ((match = regex.exec(content)) !== null) {
        const title = match[1];
        const list =
            match[2]
            .trim()
            .split('\n')
            .map(item => item.trim().replace(/^\-\s+/, ''));

        result.push({ title, list });
    }

    return result;
}

export function create_rss() {
    let site = {
        title: "Wiljam's Digital Garden",
        icon: "https://wiljam144.github.io/assets/img/favicon.png"
    }

    const changelog = get_changelog();

    let rss = "";
    rss += `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE xml>`;
    rss += `<feed xmlns="http://www.w3.org/2005/Atom">`;
    rss += `<title>${site.title}</title>`;
    rss += `<link rel="self" type="application/atom+xml" href="https://wiljam144.github.io/digital-garden/rss.xml"></link>`;
    rss += `<updated>${convert_to_iso_date(changelog[0].title)}</updated>`;
    rss += `<author><name>Wiljam Holmes</name><email>wiljam1444@gmail.com</email></author>`;
    rss += `<icon>${site.icon}</icon>`;
    rss += `<id>https://wiljam144.github.io/digital-garden/</id>`;

    for (let month of changelog) {
        rss += `<entry>`;

        rss += `<title>Wiljam's Digital Garden Changelog: ${month.title}</title>`;
        rss += `<link rel="self" type="application/atom+xml" href="https://wiljam144.github.io/digital-garden/changelog.html"></link>`;
        rss += `<id>https://wiljam144.github.io/digital-garden/changelog.html</id>`;
        rss += `<updated>${convert_to_iso_date(month.title)}</updated>`;
        rss += `<content type="html"><![CDATA[`;

        rss += `<p><ul>`
        for (let item of month.list) {
            rss += `<li>${item}</li>`;
        }
        rss += `</ul><p> ]]>`;

        rss += `</content></entry>`;
    }

    rss += `</feed>`;

    fs.writeFileSync("./build/rss.xml", rss);
}
