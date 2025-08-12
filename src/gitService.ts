import * as vscode from 'vscode';
import * as path from 'path';

export interface CodeChange {
    filePath: string;
    description: string;
    type: 'added' | 'modified' | 'deleted' | 'renamed';
    language?: string;
    linesAdded?: number;
    linesDeleted?: number;
}

export async function getGitChanges(workspacePath: string): Promise<CodeChange[]> {
    try {
        // Get the git extension
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            throw new Error('Git extension not found');
        }

        const git = gitExtension.exports;
        const repository = git.getRepository(workspacePath);
        
        if (!repository) {
            throw new Error('No git repository found');
        }

        // Get the current changes
        const changes = repository.state.workingTreeChanges;
        const changesList: CodeChange[] = [];

        for (const change of changes) {
            const filePath = change.uri.fsPath;
            const relativePath = path.relative(workspacePath, filePath);
            const language = getLanguageFromFile(filePath);
            
            let description = '';
            let type: 'added' | 'modified' | 'deleted' | 'renamed' = 'modified';
            
            switch (change.status) {
                case 1: // Modified
                    type = 'modified';
                    description = `Modified ${relativePath}`;
                    break;
                case 2: // Added
                    type = 'added';
                    description = `Added ${relativePath}`;
                    break;
                case 3: // Deleted
                    type = 'deleted';
                    description = `Deleted ${relativePath}`;
                    break;
                case 4: // Renamed
                    type = 'renamed';
                    description = `Renamed ${relativePath}`;
                    break;
                default:
                    description = `Changed ${relativePath}`;
            }

            // Try to get more context about the changes
            if (type === 'modified' || type === 'added') {
                try {
                    const document = await vscode.workspace.openTextDocument(change.uri);
                    const content = document.getText();
                    const lines = content.split('\n');
                    
                    // Analyze the content to provide better description
                    if (language === 'typescript' || language === 'javascript') {
                        description = analyzeJavaScriptChanges(content, relativePath);
                    } else if (language === 'python') {
                        description = analyzePythonChanges(content, relativePath);
                    } else if (language === 'java') {
                        description = analyzeJavaChanges(content, relativePath);
                    } else {
                        description = `Updated ${relativePath} (${lines.length} lines)`;
                    }
                } catch (error) {
                    // If we can't read the file, keep the basic description
                }
            }

            changesList.push({
                filePath: relativePath,
                description,
                type,
                language,
                linesAdded: type === 'added' ? 1 : undefined,
                linesDeleted: type === 'deleted' ? 1 : undefined
            });
        }

        return changesList;
    } catch (error) {
        console.error('Error getting git changes:', error);
        throw error;
    }
}

function getLanguageFromFile(filePath: string): string | undefined {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: { [key: string]: string } = {
        '.ts': 'typescript',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.tsx': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.cs': 'csharp',
        '.php': 'php',
        '.rb': 'ruby',
        '.go': 'go',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.less': 'less',
        '.json': 'json',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown'
    };
    
    return languageMap[ext];
}

function analyzeJavaScriptChanges(content: string, filePath: string): string {
    const lines = content.split('\n');
    const functions = content.match(/function\s+(\w+)|(\w+)\s*[:=]\s*(?:async\s*)?\(/g) || [];
    const classes = content.match(/class\s+(\w+)/g) || [];
    const imports = content.match(/import\s+.*from\s+['"`]([^'"`]+)['"`]/g) || [];
    
    if (functions.length > 0 || classes.length > 0) {
        const funcNames = functions.map(f => f.replace(/function\s+|[:=]\s*(?:async\s*)?\(/g, '')).filter(f => f);
        const classNames = classes.map(c => c.replace('class ', ''));
        
        if (classNames.length > 0) {
            return `Updated ${filePath} - classes: ${classNames.join(', ')}`;
        } else if (funcNames.length > 0) {
            return `Updated ${filePath} - functions: ${funcNames.join(', ')}`;
        }
    }
    
    if (imports.length > 0) {
        return `Updated ${filePath} - added imports`;
    }
    
    return `Updated ${filePath} (${lines.length} lines)`;
}

function analyzePythonChanges(content: string, filePath: string): string {
    const lines = content.split('\n');
    const functions = content.match(/def\s+(\w+)/g) || [];
    const classes = content.match(/class\s+(\w+)/g) || [];
    const imports = content.match(/import\s+\w+|from\s+\w+\s+import/g) || [];
    
    if (functions.length > 0 || classes.length > 0) {
        const funcNames = functions.map(f => f.replace('def ', ''));
        const classNames = classes.map(c => c.replace('class ', ''));
        
        if (classNames.length > 0) {
            return `Updated ${filePath} - classes: ${classNames.join(', ')}`;
        } else if (funcNames.length > 0) {
            return `Updated ${filePath} - functions: ${funcNames.join(', ')}`;
        }
    }
    
    if (imports.length > 0) {
        return `Updated ${filePath} - added imports`;
    }
    
    return `Updated ${filePath} (${lines.length} lines)`;
}

function analyzeJavaChanges(content: string, filePath: string): string {
    const lines = content.split('\n');
    const methods = content.match(/(?:public|private|protected)?\s*(?:static\s+)?\w+\s+\w+\s*\(/g) || [];
    const classes = content.match(/class\s+(\w+)/g) || [];
    const imports = content.match(/import\s+[\w.]+;/g) || [];
    
    if (methods.length > 0 || classes.length > 0) {
        const methodNames = methods.map(m => m.replace(/(?:public|private|protected)?\s*(?:static\s+)?\w+\s+(\w+)\s*\(/, '$1')).filter(m => m);
        const classNames = classes.map(c => c.replace('class ', ''));
        
        if (classNames.length > 0) {
            return `Updated ${filePath} - classes: ${classNames.join(', ')}`;
        } else if (methodNames.length > 0) {
            return `Updated ${filePath} - methods: ${methodNames.join(', ')}`;
        }
    }
    
    if (imports.length > 0) {
        return `Updated ${filePath} - added imports`;
    }
    
    return `Updated ${filePath} (${lines.length} lines)`;
}
