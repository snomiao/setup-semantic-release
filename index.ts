import path from "path";
import { config } from "process";

const configPath = path.resolve("~/.config/setup-semantic-release.json");
type Config = {
  NPM_TOKEN: string;
};

if (import.meta.main) {
  await setupSemanticRelease();
}

export default async function setupSemanticRelease() {
  await checkPwdIsGitRoot();
  await checkGitClean();
  await configSemanticRelease();
  await configGithubAction();
  await gitCommit();

  // Fetch package name from package.json
  const packageJson = await Bun.file("package.json").json();
  const packagename = packageJson.name;

  // Fetch repo info from git remote
  const remoteUrl = (await Bun.$`git remote get-url origin`.text()).trim();
  const repoMatch = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  const repoOwner = repoMatch?.[1] || "your-username";
  const repoName = repoMatch?.[2] || "your-repo";

  console.log("\n=== Setup Complete ===");
  console.log("Don't forget to configure OIDC for NPM publishing!");
  console.log(`Visit: https://www.npmjs.com/package/${packagename}/access`);
  console.log("Steps:");
  console.log(`  1. Set repo = ${repoOwner}/${repoName}`);
  console.log("  2. Set workflow name = release.yml");
  console.log("=====================\n");
}
async function checkPwdIsGitRoot() {
  if (
    (await Bun.$`git rev-parse --show-toplevel`.text()).trim() !== process.cwd()
  ) {
    throw new Error("Current working directory is not a git repository root");
  }
}
async function checkGitClean() {
  if ((await Bun.$`git status --porcelain`.text()).trim().length > 0) {
    throw new Error("Git worktree is not clean");
  }
}

async function configSemanticRelease() {
  await Bun.$`bun i -D semantic-release`;
}
async function configGithubAction() {
  const actionPath = ".github/workflows/release.yml";
  const actionDefaultContent = await Bun.file(
    import.meta.dir + "/" + actionPath
  ).text();
  if (await Bun.file(actionPath).exists()) {
    console.log("github action already exists, skipping: " + actionPath);
  } else {
    await Bun.write(actionPath, actionDefaultContent, { createPath: true });
  }
}
async function gitCommit() {
  await Bun.$`git add .`;
  await Bun.$`git commit -am "chore: setup semantic release"`;
}

async function prompt(question: string) {
  // use nodejs readline to prompt user for input
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
/**
 * Sync configuration from multiple sources.
 * 
 * value prio
 * 1. cmd args
 * 2. process.env
 * 3. config file
 * 4. prompt user (will save to config file if provided)
 */
async function syncConfig(configPath = path.resolve("~/.config/setup-semantic-release.json")): Promise<Config> {

  const config: Config = {
    NPM_TOKEN: process.env.NPM_TOKEN || (await prompt("Please enter your NPM_TOKEN for semantic-release (leave empty to skip): ")),
  };
  await Bun.write(configPath, JSON.stringify(config, null, 2), {
    createPath: true,
  });
  return config;
}