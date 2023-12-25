let is_search_shown = false;

function menu_btn() {
    const search = document.getElementById("search");
    const content = document.getElementById("content");

    if (!is_search_shown) {
        search.style.display = "flex";
        content.style.display = "none";
    }
    else {
        search.style.display = "none";
        content.style.display = "inline-block";
    }
    is_search_shown = !is_search_shown;
}

const search_input = document.getElementById("search-input");

search_input.value = "";
document.getElementById("results").innerHTML = "";

let data;
let arr = [];
download_search_data().then(d => {
    data = d;

    for (const prop in data) {
        arr.push(prop);
    }

    arr = sort_alphabetically(arr);

    display_results(arr, data);
});

search_input.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        return;
    }

    search(search_input.value);
});

function search(search_term) {
    if (search_term === "") {
        arr = sort_alphabetically(arr);
    }
    else {
        arr.sort((a, b) => {
            return jaro_winkler_distance(b, search_term) - jaro_winkler_distance(a, search_term);
        });
    }

    display_results(arr, data);
}

function display_results(arr, data) {
    let results = document.getElementById("results");
    results.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        if (i >= arr.length) {
            break;
        }

        const element = arr[i];
        results.innerHTML +=
            `<a class="search-result" href="/digital-garden/${data[element]}">✧ ${element}</a>`
    }
}

async function download_search_data() {
    let response = await fetch("/digital-garden/static/navigation.json");

    if (response.status != 200) {
        alert("Couldn't access search data");
    }

    let text_data = await response.text();

    return JSON.parse(text_data);
}

function sort_alphabetically(arr) {
    return arr.sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    });
}

function jaro_winkler_distance(str1, str2, p = 0.1) {
    const jaro_similarity = function (s1, s2) {
        if (s1.length === 0 && s2.length === 0) return 1;

        const match_distance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
        const matches1 = Array(s1.length).fill(false);
        const matches2 = Array(s2.length).fill(false);
        let match_count = 0;

        for (let i = 0; i < s1.length; i++) {
            for (let j = Math.max(0, i - match_distance); j < Math.min(s2.length, i + match_distance + 1); j++) {
                if (!matches2[j] && s1[i] === s2[j]) {
                    matches1[i] = true;
                    matches2[j] = true;
                    match_count++;
                    break;
                }
            }
        }

        if (match_count === 0) return 0;

        const transpositions = [];
        let k = 0;

        for (let i = 0; i < s1.length; i++) {
            if (matches1[i]) {
                while (!matches2[k]) k++;
                if (s1[i] !== s2[k]) transpositions.push([s1[i], s2[k]]);
                k++;
            }
        }

        const jaro_similarity_value = (match_count / s1.length + match_count / s2.length + (match_count - transpositions.length / 2) / match_count) / 3;
        return jaro_similarity_value;
    };

    const jaro_distance = jaro_similarity(str1, str2);
    const common_prefix_length = (() => {
        const min_length = Math.min(str1.length, str2.length);
        for (let i = 0; i < min_length; i++) {
            if (str1[i] !== str2[i]) {
                return i;
            }
        }
        return min_length;
    })();

    const prefix_scale = 0.1; // recommended value by Winkler
    const jaro_winkler_distance_value = jaro_distance + common_prefix_length * prefix_scale * (1 - jaro_distance);

    return jaro_winkler_distance_value;
}
