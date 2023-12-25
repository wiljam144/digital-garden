import { create_rss } from "./rss.js";

import { clean, build } from "./build.js";

clean();
build([], []);

create_rss();