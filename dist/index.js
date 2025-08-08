"use strict";
// Punto de entrada principal de la aplicación
// Demuestra inicialización y configuración
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
/**
 * Función principal para iniciar la aplicación
 * Demuestra manejo de configuración y errores de inicio
 */
function main() {
    try {
        // Configuración del puerto
        const port = parseInt(process.env.PORT || '3000', 10);
        // Validar puerto
        if (isNaN(port) || port < 1 || port > 65535) {
            throw new Error('Puerto inválido. Debe ser un número entre 1 y 65535');
        }
        // Crear y iniciar la aplicación
        const app = new app_1.App();
        console.log('🔧 Inicializando aplicación...');
        console.log('📋 Principios implementados:');
        console.log('   ✅ SOLID (SRP, OCP, LSP, ISP, DIP)');
        console.log('   ✅ Alta cohesión y bajo acoplamiento');
        console.log('   ✅ Inyección de dependencias');
        console.log('   ✅ Clean Code y POO');
        console.log('');
        app.listen(port);
    }
    catch (error) {
        console.error('❌ Error al iniciar la aplicación:', error);
        process.exit(1);
    }
}
/**
 * Manejo de señales del sistema
 */
process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal SIGINT. Cerrando aplicación...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Recibida señal SIGTERM. Cerrando aplicación...');
    process.exit(0);
});
/**
 * Manejo de errores no capturados
 */
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    console.error('En promesa:', promise);
    process.exit(1);
});
// Iniciar la aplicación
main();
//# sourceMappingURL=index.js.map