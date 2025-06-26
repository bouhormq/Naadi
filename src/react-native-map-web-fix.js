const { readFile, writeFile, mkdir } = require('fs').promises;

async function reactNativeMaps() {
  console.log('[react-native-maps] 📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds');
  const modulePath = 'node_modules/react-native-maps';
  const libPath = `${modulePath}/lib`;

  try {
    await mkdir(libPath, { recursive: true });
    await writeFile(`${libPath}/index.web.js`, 'module.exports = {}', 'utf-8');
    await writeFile(`${libPath}/index.web.d.ts`, 'export {};', 'utf-8');

    console.log('[react-native-maps] ✅ script ran successfully');
  } catch (error) {
    console.log('[react-native-maps] ❌ Error during script execution:');
    console.error(error);
    process.exit(1);
  }
}

reactNativeMaps();
