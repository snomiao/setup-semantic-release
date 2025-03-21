if (import.meta.main) {
  await setupSemanticRelease();
}

export default async function setupSemanticRelease() {
  await checkPwdIsGitRoot();
  await checkGitClean();
  await configHusky();
  await configCommitLint();
  await configSemanticRelease();
  await configGithubAction();
  await gitCommit();
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
async function configHusky() {
  await Bun.$`bun i husky -D`;
  await Bun.$`bunx husky init`;
  //   await Bun.$`echo 'bunx commitlint --edit $1' > .husky/commit-msg`;
}
async function configCommitLint() {
  // WIP
  // await Bun.$`bun i -D @commitlint/config-conventional @commitlint/cli`;
}
async function configSemanticRelease() {
  await Bun.$`bun i -D semantic-release`;
}
async function configGithubAction() {
  const actionPath = ".github/workflows/semantic-release.yml";
  const actionDefaultContent = await Bun.file(
    import.meta.dir + "/" + actionPath
  ).text();
  if (await Bun.file(actionPath).exists()) {
    console.log("github action already exists, skipping: " + actionPath);
  } else {
    await Bun.write(actionPath, actionDefaultContent, { createPath: true });
  }

  await configGithubActionSecrets().catch(() => null);
}
async function configGithubActionSecrets() {
  if (process.env.NPM_TOKEN) {
    await Bun.$`gh --version || curl -fSSL get-gh.vercel.app | bash`;
    await Bun.$`gh secret set NPM_TOKEN -b ${process.env.NPM_TOKEN}`;
  } else {
    console.log(`
gh secret set NPM_TOKEN -b $NPM_TOKEN
`);
    console.log("please don't forget setup NPM_TOKEN on repo secrets");
  }
}

async function gitCommit() {
  await Bun.$`git add .`;
  await Bun.$`git commit -am "chore: setup semantic release"`;
}
