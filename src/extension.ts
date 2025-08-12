import * as vscode from 'vscode';
import { generateCommitMessage } from './commitMessageGenerator.js';
import { getGitChanges } from './gitService';

export function activate(context: vscode.ExtensionContext) {
    console.log('Commit Message Generator extension is now active!');

    // Register command to generate commit message from current changes
    let generateFromChanges = vscode.commands.registerCommand('commitMessageGenerator.generateMessageFromChanges', async () => {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const changes = await getGitChanges(workspaceFolder.uri.fsPath);
            if (!changes || changes.length === 0) {
                vscode.window.showInformationMessage('No changes detected in the repository');
                return;
            }

            const commitMessage = await generateCommitMessage(changes);
            
            // Show the generated message in a new document
            const document = await vscode.workspace.openTextDocument({
                content: commitMessage,
                language: 'markdown'
            });
            
            await vscode.window.showTextDocument(document);
            
            // Copy to clipboard
            await vscode.env.clipboard.writeText(commitMessage);
            vscode.window.showInformationMessage('Commit message copied to clipboard!');
            
        } catch (error) {
            vscode.window.showErrorMessage(`Error generating commit message: ${error}`);
        }
    });

    // Register command to generate commit message manually
    let generateMessage = vscode.commands.registerCommand('commitMessageGenerator.generateMessage', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'Describe the changes you made (optional)',
            placeHolder: 'e.g., Added user authentication feature'
        });

        if (input !== undefined) {
            try {
                const commitMessage = await generateCommitMessage([{ 
                    filePath: 'manual-input',
                    description: input,
                    type: 'modified'
                }]);
                
                const document = await vscode.workspace.openTextDocument({
                    content: commitMessage,
                    language: 'markdown'
                });
                
                await vscode.window.showTextDocument(document);
                await vscode.env.clipboard.writeText(commitMessage);
                vscode.window.showInformationMessage('Commit message copied to clipboard!');
                
            } catch (error) {
                vscode.window.showErrorMessage(`Error generating commit message: ${error}`);
            }
        }
    });

    context.subscriptions.push(generateFromChanges, generateMessage);
}

export function deactivate() {}
