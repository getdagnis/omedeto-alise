const fs = require('fs');

function restore(jsonFile, targetFile) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    let content = data.output;
    // Remove truncation warning if present just in case
    const warningSplit = '\n--- FILE CONTENT (truncated) ---\n';
    if (content.includes(warningSplit)) {
      content = content.split(warningSplit)[1];
    }
    fs.writeFileSync(targetFile, content);
    console.log('Restored', targetFile, 'Length:', content.length);
  } catch (e) {
    console.error('Failed to restore', targetFile, e.message);
  }
}

restore('/Users/dagnisskurbe/.gemini/tmp/omedeto-alise/tool-outputs/session-d3258e44-4f04-4731-9115-7b26d683f8a1/read_file_read_file_1775341273372_1_nh6aqj.txt', 'src/App.tsx');
restore('/Users/dagnisskurbe/.gemini/tmp/omedeto-alise/tool-outputs/session-d3258e44-4f04-4731-9115-7b26d683f8a1/read_file_read_file_1775341273373_3_msnfrg.txt', 'src/components/CharacterProfile/CharacterProfile.tsx');
restore('/Users/dagnisskurbe/.gemini/tmp/omedeto-alise/tool-outputs/session-d3258e44-4f04-4731-9115-7b26d683f8a1/read_file_read_file_1775341273373_4_1bv7qn.txt', 'src/components/CharacterProfile/CharacterProfile.module.sass');
