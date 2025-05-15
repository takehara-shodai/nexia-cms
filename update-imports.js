import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all TypeScript and TypeScript React files
exec('find src -type f -name "*.ts" -o -name "*.tsx"', (error, stdout) => {
  if (error) {
    console.error(`Error finding files: ${error}`);
    return;
  }

  const files = stdout.trim().split('\n');
  let updatedFilesCount = 0;

  files.forEach(filePath => {
    if (!filePath) return;

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace relative imports with absolute imports
    const updatedContent = content.replace(
      /from\s+['"]\.\.\/(.+)['"]/g, 
      (match, importPath) => {
        // Determine how many levels up
        const dirPath = path.dirname(filePath);
        const srcRelativePath = path.relative('src', dirPath);
        const levels = srcRelativePath.split(path.sep).length;
        
        // For each level, remove one '../'
        let absolutePath = importPath;
        for (let i = 0; i < levels; i++) {
          if (absolutePath.startsWith('../')) {
            absolutePath = absolutePath.substring(3);
          }
        }
        
        return `from '@/${absolutePath}'`;
      }
    );

    // Also replace imports like './components/...' with '@/components/...'
    const finalContent = updatedContent.replace(
      /from\s+['"]\.\/(.*)['"]/g,
      (match, importPath) => {
        const dirPath = path.dirname(filePath);
        const relativeSrcPath = path.relative('src', dirPath);
        
        if (relativeSrcPath === '') {
          // We're directly in the src folder
          return `from '@/${importPath}'`;
        } else {
          // We need to figure out the right path
          return `from '@/${relativeSrcPath}/${importPath}'`;
        }
      }
    );

    if (content !== finalContent) {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      updatedFilesCount++;
      console.log(`Updated: ${filePath}`);
    }
  });

  console.log(`\nTotal files updated: ${updatedFilesCount}`);
}); 