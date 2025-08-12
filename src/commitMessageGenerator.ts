import { CodeChange } from './gitService';
import OpenAI from 'openai';

export async function generateCommitMessage(changes: CodeChange[]): Promise<string> {
    try {
        // Check if OpenAI API key is configured
        const config = require('vscode').workspace.getConfiguration('commitMessageGenerator');
        const apiKey = config.get('openaiApiKey');
        
        if (!apiKey) {
            // Fallback to rule-based generation if no API key
            return generateRuleBasedCommitMessage(changes);
        }

        // Use OpenAI for intelligent commit message generation
        return await generateAIBasedCommitMessage(changes, apiKey);
    } catch (error) {
        console.error('Error generating commit message:', error);
        // Fallback to rule-based generation
        return generateRuleBasedCommitMessage(changes);
    }
}

async function generateAIBasedCommitMessage(changes: CodeChange[], apiKey: string): Promise<string> {
    const openai = new OpenAI({
        apiKey: apiKey
    });

    const changesSummary = changes.map(change => 
        `- ${change.type}: ${change.description}`
    ).join('\n');

    const prompt = `You are a professional software developer. Generate a concise, descriptive commit message based on the following code changes. 

Follow conventional commit format: <type>(<scope>): <description>

Rules:
1. Use conventional commit types: feat, fix, docs, style, refactor, test, chore, etc.
2. Keep the description under 50 characters
3. Be specific about what changed
4. Use imperative mood ("add" not "added")
5. Focus on the "why" not just the "what"

Changes:
${changesSummary}

Generate only the commit message, no additional text:`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates commit messages following conventional commit standards."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 100,
            temperature: 0.3
        });

        const commitMessage = completion.choices[0]?.message?.content?.trim();
        if (commitMessage) {
            return commitMessage;
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
    }

    // Fallback to rule-based generation
    return generateRuleBasedCommitMessage(changes);
}

function generateRuleBasedCommitMessage(changes: CodeChange[]): string {
    if (changes.length === 0) {
        return "chore: update code";
    }

    if (changes.length === 1) {
        const change = changes[0];
        return generateSingleChangeMessage(change);
    }

    // Multiple changes - analyze patterns
    const types = changes.map(c => c.type);
    const languages = changes.filter(c => c.language).map(c => c.language);
    const uniqueLanguages = [...new Set(languages)];

    // Determine the main type of change
    if (types.includes('added') && types.includes('modified')) {
        if (uniqueLanguages.length === 1) {
            return `feat(${uniqueLanguages[0]}): add new features and update existing code`;
        }
        return "feat: add new features and update existing code";
    }

    if (types.includes('deleted')) {
        if (types.includes('modified')) {
            return "refactor: restructure and remove unused code";
        }
        return "chore: remove unused files";
    }

    if (types.includes('renamed')) {
        return "refactor: reorganize file structure";
    }

    // Default for multiple modifications
    if (uniqueLanguages.length === 1) {
        return `fix(${uniqueLanguages[0]}): resolve issues and improve code`;
    }
    
    return "fix: resolve issues and improve code";
}

function generateSingleChangeMessage(change: CodeChange): string {
    const { type, description, language, filePath } = change;
    
    // Extract file name without extension
    const fileName = filePath.split('/').pop()?.split('.')[0] || 'file';
    
    switch (type) {
        case 'added':
            if (language) {
                return `feat(${language}): add ${fileName}`;
            }
            return `feat: add ${fileName}`;
            
        case 'deleted':
            if (language) {
                return `chore(${language}): remove ${fileName}`;
            }
            return `chore: remove ${fileName}`;
            
        case 'renamed':
            if (language) {
                return `refactor(${language}): rename ${fileName}`;
            }
            return `refactor: rename ${fileName}`;
            
        case 'modified':
        default:
            if (language) {
                return `fix(${language}): update ${fileName}`;
            }
            return `fix: update ${fileName}`;
    }
}

// Helper function to determine commit type based on file patterns
function determineCommitType(changes: CodeChange[]): string {
    const hasTests = changes.some(c => 
        c.filePath.includes('.test.') || 
        c.filePath.includes('.spec.') || 
        c.filePath.includes('__tests__') ||
        c.filePath.includes('test/')
    );
    
    const hasDocs = changes.some(c => 
        c.filePath.includes('.md') || 
        c.filePath.includes('docs/') ||
        c.filePath.includes('README')
    );
    
    const hasConfig = changes.some(c => 
        c.filePath.includes('package.json') || 
        c.filePath.includes('tsconfig.json') ||
        c.filePath.includes('.eslintrc') ||
        c.filePath.includes('webpack.config')
    );
    
    if (hasTests) return 'test';
    if (hasDocs) return 'docs';
    if (hasConfig) return 'chore';
    
    return 'fix';
}
