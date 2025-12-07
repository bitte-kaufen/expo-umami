# Contributing to @bitte-kaufen/expo-umami

Thanks for your interest in contributing!

## Development Setup

1. **Fork and clone** the repository
```bash
git clone https://github.com/YOUR_USERNAME/expo-umami.git
cd expo-umami
```

2. **Install dependencies**
```bash
yarn install
```

3. **Run tests**
```bash
yarn test
```

4. **Build the package**
```bash
yarn build
```

## Development Workflow

### Making Changes

1. Create a new branch
```bash
git checkout -b feature/my-new-feature
```

2. Make your changes

3. Run tests
```bash
yarn test
```

4. Build to ensure no TypeScript errors
```bash
yarn build
```

5. Commit your changes
```bash
git commit -m "feat: add new feature"
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test changes
- `chore:` - Build/tooling changes

### Testing Your Changes

To test your changes in a real Expo app:

```bash
# In the package directory
yarn link

# In your test app
yarn link "@bitte-kaufen/expo-umami"
```

## Pull Request Process

1. Update the README.md or documentation if needed
2. Add tests for new features
3. Ensure all tests pass (`yarn test`)
4. Ensure build succeeds (`yarn build`)
5. Update CHANGELOG.md with your changes
6. Submit a pull request

## Code Style

- Use TypeScript
- Use dasherized file names (e.g., `event-queue.ts`)
- Follow existing code style
- Add JSDoc comments for public APIs

## Questions?

Open an issue or reach out to the maintainers!
