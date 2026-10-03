// Runs before `next build`. For a partial (code-only) deployment, fills in
// every file that is missing — photos and unchanged source — from the public
// GitHub repo, without overwriting any file that was deployed. Then makes the
// transparent logo files if they are not there yet.
// Never fails the build on its own: on error it logs and continues.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { makeLogos } from "./make-logo.mjs";

const markers = ["tsconfig.json", "public/products", "public/clients"];
const missing = markers.filter((d) => !existsSync(d) || (d.startsWith("public") && readdirSync(d).length === 0));

if (missing.length > 0) {
  try {
    const url = "https://codeload.github.com/m2o2a/first-class-uniform-catalog/tar.gz/refs/heads/main";
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const dir = "/tmp/fc-assets";
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/repo.tgz`, Buffer.from(await res.arrayBuffer()));
    execSync(`tar -xzf ${dir}/repo.tgz -C ${dir}`);
    const root = `${dir}/` + readdirSync(dir).find((d) => d.startsWith("first-class"));
    execSync(`cp -rn "${root}/." ./`);
    console.log("[fetch-assets] filled missing files from GitHub:", missing.join(", "));
  } catch (e) {
    console.warn("[fetch-assets] could not fetch from GitHub:", e.message);
  }
} else {
  console.log("[fetch-assets] full source present");
}

try {
  if (!existsSync("public/logo/logo-mark.png") && existsSync("public/logo/logo.png")) {
    makeLogos("public/logo/logo.png", "public/logo/logo.png", "public/logo/logo-mark.png");
    console.log("[fetch-assets] generated transparent logo + logo-mark");
  }
} catch (e) {
  console.warn("[fetch-assets] logo step failed:", e.message);
}
