import { readFileSync, writeFileSync } from "node:fs";

const manifestPath = "dist-prod/manifest.json";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

// The source manifest carries a placeholder so parcel has something valid to
// emit. Bailing when it is missing keeps a silent no-op from shipping an
// extension stamped with the placeholder, which is how the previous sed-based
// substitution failed when parcel started minifying the manifest.
if (manifest.version !== "0") {
    throw new Error(
        `Expected placeholder version "0" in ${manifestPath}, found "${manifest.version}"`,
    );
}

manifest.version = version;
writeFileSync(manifestPath, JSON.stringify(manifest));
