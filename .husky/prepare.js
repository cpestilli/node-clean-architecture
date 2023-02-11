// as suggested in https://typicode.github.io/husky/#/?id=disable-husky-in-cidockerprod
if (process.env.CI !== undefined) {
  console.log('skip installing git hooks in CI')
  return
}

try {
  console.log('installing git hooks with husky')
  require('husky').install()
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log('skip installing git hooks because husky is not installed')
  }
  throw e
}
