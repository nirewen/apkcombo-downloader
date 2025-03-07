const TARGETS = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-arm64",
  "bun-linux-x64",
  "bun-windows-x64",
];

for (const target of TARGETS) {
  console.log(`🏗️  Compiling CLI for ${target}`);
  await Bun.$`bun build --compile --target=${target} ./src/cli.ts --outfile ./out/apkmd-${target}`;
}
