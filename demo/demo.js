// Demo script to show how the Commit Message Generator extension works
// This simulates the kind of analysis the extension would perform

console.log('🚀 Commit Message Generator Extension Demo\n');

// Simulate git changes that the extension would detect
const mockChanges = [
    {
        filePath: 'src/services/UserService.ts',
        description: 'Added UserService class with CRUD operations',
        type: 'added',
        language: 'typescript'
    },
    {
        filePath: 'src/models/User.ts',
        description: 'Added User interface with role-based permissions',
        type: 'added',
        language: 'typescript'
    },
    {
        filePath: 'src/utils/validation.ts',
        description: 'Updated validation functions - added email validation',
        type: 'modified',
        language: 'typescript'
    },
    {
        filePath: 'tests/UserService.test.ts',
        description: 'Added comprehensive test suite for UserService',
        type: 'added',
        language: 'typescript'
    }
];

console.log('📋 Detected Changes:');
mockChanges.forEach((change, index) => {
    console.log(`${index + 1}. ${change.type.toUpperCase()}: ${change.filePath}`);
    console.log(`   ${change.description}`);
    console.log(`   Language: ${change.language}\n`);
});

// Simulate rule-based commit message generation
function generateRuleBasedMessage(changes) {
    const types = changes.map(c => c.type);
    const languages = [...new Set(changes.map(c => c.language))];
    
    if (types.includes('added') && types.includes('modified')) {
        if (languages.length === 1) {
            return `feat(${languages[0]}): add new features and update existing code`;
        }
        return "feat: add new features and update existing code";
    }
    
    if (types.includes('added')) {
        if (languages.length === 1) {
            return `feat(${languages[0]}): implement new functionality`;
        }
        return "feat: implement new functionality";
    }
    
    return "fix: update and improve existing code";
}

// Simulate AI-based commit message generation
function generateAIMessage(changes) {
    const hasTests = changes.some(c => c.filePath.includes('.test.'));
    const hasServices = changes.some(c => c.filePath.includes('Service'));
    const hasModels = changes.some(c => c.filePath.includes('models'));
    
    if (hasTests && hasServices && hasModels) {
        return "feat(auth): implement user management system with tests";
    }
    
    if (hasServices) {
        return "feat(services): add UserService with CRUD operations";
    }
    
    return "feat: add new features and improve code structure";
}

console.log('🤖 Generated Commit Messages:\n');

const ruleBasedMessage = generateRuleBasedMessage(mockChanges);
console.log(`📝 Rule-based: ${ruleBasedMessage}`);

const aiMessage = generateAIMessage(mockChanges);
console.log(`🤖 AI-powered: ${aiMessage}`);

console.log('\n✨ The extension would:');
console.log('1. Analyze your git changes automatically');
console.log('2. Detect file types and programming languages');
console.log('3. Generate conventional commit messages');
console.log('4. Copy the message to your clipboard');
console.log('5. Show the message in a new document');

console.log('\n🎯 Usage:');
console.log('- Use the SCM button to generate from git changes');
console.log('- Use Command Palette for manual generation');
console.log('- Configure OpenAI API key for AI-powered messages');

console.log('\n🚀 Extension is ready to use!');
