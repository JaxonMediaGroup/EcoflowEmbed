// Script de ofuscación para archivos de clientes
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuración de ofuscación
const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Función para ofuscar un archivo
function obfuscateFile(inputFile) {
    const outputFile = inputFile.replace('.js', '.min.js');
    
    console.log(`📦 Ofuscando: ${inputFile}`);
    
    try {
        // Leer archivo original
        const sourceCode = fs.readFileSync(inputFile, 'utf8');
        
        // Ofuscar
        const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, obfuscatorOptions);
        
        // Guardar archivo ofuscado
        fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode());
        
        // Calcular reducción de tamaño legible
        const originalSize = Buffer.byteLength(sourceCode, 'utf8');
        const obfuscatedSize = Buffer.byteLength(obfuscationResult.getObfuscatedCode(), 'utf8');
        const reduction = ((1 - obfuscatedSize / originalSize) * 100).toFixed(2);
        
        console.log(`✅ Creado: ${outputFile}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   Ofuscado: ${(obfuscatedSize / 1024).toFixed(2)} KB`);
        console.log(`   Reducción: ${reduction}%\n`);
        
        return true;
    } catch (error) {
        console.error(`❌ Error al ofuscar ${inputFile}:`, error.message);
        return false;
    }
}

// Obtener archivos a ofuscar desde argumentos o buscar automáticamente
const args = process.argv.slice(2);

if (args.includes('--all')) {
    // Ofuscar todos los archivos ecoflow-*.js excepto ecoflow-core.js
    console.log('🚀 Ofuscando todos los archivos de clientes...\n');
    
    const files = fs.readdirSync('.')
        .filter(file => file.startsWith('ecoflow-') && 
                       file.endsWith('.js') && 
                       !file.endsWith('.min.js') &&
                       file !== 'ecoflow-core.js' &&
                       file !== 'ecoflow-template.js');
    
    if (files.length === 0) {
        console.log('⚠️  No se encontraron archivos de clientes para ofuscar');
        process.exit(0);
    }
    
    let successCount = 0;
    files.forEach(file => {
        if (obfuscateFile(file)) {
            successCount++;
        }
    });
    
    console.log(`\n🎉 Proceso completado: ${successCount}/${files.length} archivos ofuscados exitosamente`);
    
} else if (args.length > 0) {
    // Ofuscar archivos específicos
    console.log('🚀 Ofuscando archivos específicos...\n');
    
    let successCount = 0;
    args.forEach(file => {
        // Agregar extensión .js si no la tiene
        const fileName = file.endsWith('.js') ? file : `${file}.js`;
        
        if (!fs.existsSync(fileName)) {
            console.log(`⚠️  Archivo no encontrado: ${fileName}\n`);
            return;
        }
        
        if (obfuscateFile(fileName)) {
            successCount++;
        }
    });
    
    console.log(`\n🎉 Proceso completado: ${successCount}/${args.length} archivos ofuscados exitosamente`);
    
} else {
    // Modo interactivo: ofuscar todos los archivos de clientes
    console.log('🚀 Modo automático: Ofuscando archivos de clientes...\n');
    
    const files = fs.readdirSync('.')
        .filter(file => file.startsWith('ecoflow-') && 
                       file.endsWith('.js') && 
                       !file.endsWith('.min.js') &&
                       file !== 'ecoflow-core.js' &&
                       file !== 'ecoflow-template.js');
    
    if (files.length === 0) {
        console.log('⚠️  No se encontraron archivos de clientes para ofuscar');
        console.log('💡 Uso: node build.js [archivo1.js] [archivo2.js] ...');
        console.log('💡 O: npm run obfuscate:all');
        process.exit(0);
    }
    
    let successCount = 0;
    files.forEach(file => {
        if (obfuscateFile(file)) {
            successCount++;
        }
    });
    
    console.log(`\n🎉 Proceso completado: ${successCount}/${files.length} archivos ofuscados exitosamente`);
}

console.log('\n📝 Notas:');
console.log('   - Los archivos .min.js están listos para producción');
console.log('   - Sube solo los archivos .min.js a GitHub');
console.log('   - Mantén los archivos originales (.js) para edición\n');
