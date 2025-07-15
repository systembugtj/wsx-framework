# CI/CD Fixes and Solutions

## esbuild Version Conflict (Fixed)

### Issue
```
Error: Expected "0.25.6" but got "0.21.5"
at validateBinaryVersion (/home/runner/work/wsx-framework/wsx-framework/node_modules/.pnpm/esbuild@0.25.6/node_modules/esbuild/install.js:136:11)
```

### Root Cause
- Different packages in the monorepo were using different esbuild versions
- `examples` package had `esbuild: ^0.21.0`
- Other dependencies pulled in `esbuild: 0.25.6`
- pnpm couldn't resolve the version conflict in CI environment

### Solution Applied
1. **Updated examples package** esbuild version to `^0.25.0`
2. **Added esbuild as root dependency** for version consistency across monorepo
3. **Updated vite-plugin peer dependency** to require `esbuild >= 0.25.0`
4. **Cleaned and reinstalled** to resolve version conflicts

### Files Changed
- `packages/examples/package.json` - Updated esbuild to `^0.25.0`
- `package.json` - Added `esbuild: ^0.25.0` as dev dependency
- `packages/vite-plugin/package.json` - Updated peer dependency

### Prevention
- Root-level esbuild dependency ensures version consistency
- All packages now use esbuild 0.25.6
- Peer dependency updated to prevent future conflicts

## Status Check Names for GitHub Rulesets

### Required Status Checks for Develop Branch
```yaml
- "PR Validation / Validate Commits"
- "PR Validation / Lint"  
- "PR Validation / Type Check"
- "PR Validation / Test"
- "PR Validation / Build"
- "PR Validation / Coverage Report"
```

### Required Status Checks for Main Branch
```yaml
- "Release / CI"
- "Release / Build Matrix"
- "Release / Release"
```

### Workflow Job Names
Ensure GitHub Actions job names match the required status checks:

#### pr.yml
```yaml
jobs:
  commitlint:
    name: "Validate Commits"
  lint:
    name: "Lint"
  typecheck:
    name: "Type Check"
  test:
    name: "Test"
  build:
    name: "Build"
  coverage-report:
    name: "Coverage Report"
```

#### release.yml
```yaml
jobs:
  ci:
    name: "CI"
  build-matrix:
    name: "Build Matrix"
  release:
    name: "Release"
```

## Common CI Issues and Solutions

### 1. Missing NPM Token
**Issue**: `ENOGHTOKEN No GitHub token specified`
**Solution**: Add `NPM_TOKEN` secret in GitHub repository settings

### 2. Coverage Threshold Failure
**Issue**: Coverage below 80% threshold
**Solution**: 
- Add more tests to increase coverage
- Or adjust threshold in workflow if appropriate

### 3. Commitlint Failures
**Issue**: `subject must be lower-case [subject-case]`
**Solution**: Follow conventional commit format:
```bash
# ✅ Correct
git commit -m "feat: implement comprehensive ci/cd pipeline"

# ❌ Incorrect  
git commit -m "feat: Implement comprehensive CI/CD pipeline"
```

### 4. TypeScript Build Errors
**Issue**: Project reference configuration errors
**Solution**: Ensure consistent TypeScript configuration across packages

### 5. pnpm Cache Issues
**Issue**: Dependency resolution conflicts in CI
**Solution**: 
- Use `pnpm install --frozen-lockfile` in CI
- Clear cache if needed: `pnpm store prune`

## Monitoring and Debugging

### Check CI Status
1. Go to **Actions** tab in GitHub repository
2. Review failed jobs and error messages
3. Check specific step logs for detailed errors

### Local Testing
```bash
# Test CI pipeline locally
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Test semantic-release
pnpm release:dry

# Test commit message
npx commitlint --from=HEAD~1 --to=HEAD --verbose
```

### Debug Commands
```bash
# Check esbuild versions
pnpm -r list esbuild

# Check dependency conflicts
pnpm why esbuild

# Verify workspace configuration
pnpm list --depth=0

# Test coverage threshold
pnpm test:coverage
```

## Best Practices for CI Stability

1. **Pin major versions** of critical dependencies
2. **Use workspace root** for shared dependencies
3. **Test locally** before pushing to CI
4. **Monitor CI performance** and optimize as needed
5. **Keep workflows simple** and focused
6. **Document fixes** for future reference

## Future Improvements

1. **Add pre-commit hooks** for local validation
2. **Implement dependency scanning** for security
3. **Add performance benchmarks** to CI
4. **Monitor bundle size** changes
5. **Add integration tests** for real-world usage