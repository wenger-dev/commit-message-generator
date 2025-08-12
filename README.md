# Commit Message Generator

A VS Code extension that automatically generates meaningful commit messages based on your code changes. This extension analyzes your git changes and creates conventional commit messages that follow best practices.

## Features

- 🚀 **Automatic Analysis**: Detects changes in your git repository and analyzes code modifications
- 🤖 **AI-Powered**: Uses OpenAI to generate intelligent, context-aware commit messages
- 📝 **Conventional Commits**: Follows conventional commit format standards
- 🔧 **Fallback System**: Rule-based generation when AI is not available
- 📋 **Clipboard Integration**: Automatically copies generated messages to clipboard
- 🎯 **Smart Detection**: Identifies file types, languages, and change patterns
- ⚡ **Fast & Efficient**: Lightweight and doesn't slow down your workflow

## Installation

### From VSIX Package
1. Download the `.vsix` file from the releases page
2. In VS Code, go to `Extensions` (Ctrl+Shift+X)
3. Click the three dots (...) and select "Install from VSIX..."
4. Choose the downloaded file and install

### From Source
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 to run the extension in a new Extension Development Host window

## Usage

### Method 1: Generate from Git Changes (Recommended)
1. Make changes to your code
2. Open the Source Control panel (Ctrl+Shift+G)
3. Click the "Generate Commit Message from Changes" button in the SCM title bar
4. The extension will analyze your changes and generate a commit message
5. The message is automatically copied to your clipboard

### Method 2: Manual Generation
1. Press `Ctrl+Shift+P` to open the command palette
2. Type "Generate Commit Message" and select the command
3. Optionally describe your changes
4. The extension will generate an appropriate commit message

## Configuration

### OpenAI API Key (Optional)
For AI-powered commit message generation, you can configure your OpenAI API key:

1. Open VS Code Settings (Ctrl+,)
2. Search for "Commit Message Generator"
3. Enter your OpenAI API key in the `OpenAI API Key` field

**Note**: The extension works without an API key using rule-based generation.

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `openaiApiKey` | Your OpenAI API key for AI generation | `""` |
| `useAI` | Enable AI generation when API key is available | `true` |
| `commitFormat` | Format style for commit messages | `"conventional"` |

## How It Works

### 1. Change Detection
The extension analyzes your git working tree to detect:
- Added files
- Modified files
- Deleted files
- Renamed files

### 2. Code Analysis
For each changed file, it analyzes:
- File type and programming language
- Function and class definitions
- Import statements
- Code structure patterns

### 3. Message Generation
Based on the analysis, it generates commit messages following conventional commit format:

```
<type>(<scope>): <description>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scope**: Programming language or component affected
**Description**: Concise description of changes

### 4. AI Enhancement (Optional)
When OpenAI API key is configured, the extension:
- Sends change summary to GPT-3.5-turbo
- Generates context-aware, professional commit messages
- Falls back to rule-based generation if AI fails

## Examples

### Rule-based Generation
```
feat(typescript): add user authentication service
fix(python): resolve database connection timeout
refactor(java): reorganize package structure
chore: update dependencies and configuration
```

### AI-generated Examples
```
feat(auth): implement JWT-based user authentication
fix(api): resolve race condition in concurrent requests
refactor(ui): extract reusable component library
docs: add comprehensive API documentation
```

## Supported Languages

The extension automatically detects and analyzes:
- **JavaScript/TypeScript**: Functions, classes, imports, React components
- **Python**: Functions, classes, imports, decorators
- **Java**: Methods, classes, imports, annotations
- **C/C++**: Functions, classes, includes
- **C#**: Methods, classes, using statements
- **PHP**: Functions, classes, includes
- **Ruby**: Methods, classes, requires
- **Go**: Functions, structs, imports
- **Rust**: Functions, structs, use statements
- **Swift**: Functions, classes, imports
- **Kotlin**: Functions, classes, imports
- **HTML/CSS**: Structure and styling changes
- **Configuration files**: JSON, YAML, XML, etc.

## Troubleshooting

### Common Issues

**"Git extension not found"**
- Ensure you have the Git extension installed in VS Code
- Make sure you're in a git repository

**"No changes detected"**
- Check if you have uncommitted changes in your git repository
- Try refreshing the Source Control panel

**"OpenAI API error"**
- Verify your API key is correct
- Check your internet connection
- The extension will fall back to rule-based generation

**"No workspace folder found"**
- Open a folder in VS Code (File > Open Folder)
- Ensure you're working in a proper workspace

### Performance Tips

- The extension only analyzes files when you explicitly request a commit message
- Large repositories may take a moment to analyze
- AI generation requires internet connectivity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Build the extension: `npm run compile`
5. Press F5 to run in Extension Development Host

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [VS Code Extension API](https://code.visualstudio.com/api)
- AI integration powered by [OpenAI](https://openai.com/)
- Follows [Conventional Commits](https://www.conventionalcommits.org/) standards

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem

---

**Happy coding! 🎉**
