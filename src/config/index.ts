import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Defines the structure of the application configuration.
 */
interface Config {
  /** The logging level (e.g., 'debug', 'info', 'warn', 'error'). */
  logLevel: string;
  /** Neo4j database connection URL. */
  neo4jUrl: string;
  /** Neo4j database username. */
  neo4jUser: string;
  /** Neo4j database password. */
  neo4jPassword: string;
  /** Neo4j database name. */
  neo4jDatabase: string;
  /** Batch size for writing nodes/relationships to Neo4j. */
  storageBatchSize: number;
  /** Directory to store temporary analysis files. */
  tempDir: string;
  /** Maximum concurrent file parsing operations to prevent "too many open files" error. */
  maxConcurrentParses: number;
  /** Glob patterns for files/directories to ignore during scanning. */
  ignorePatterns: string[];
  /** Supported file extensions for parsing. */
  supportedExtensions: string[];
}

const config: Config = {
  logLevel: process.env.LOG_LEVEL || 'info',
  neo4jUrl: process.env.NEO4J_URL || 'neo4j://127.0.0.1:7687',
  neo4jUser: process.env.NEO4J_USER || 'neo4j',
  neo4jPassword: process.env.NEO4J_PASSWORD || 'password', // Replace with your default password
  neo4jDatabase: process.env.NEO4J_DATABASE || 'neo4j',
  storageBatchSize: parseInt(process.env.STORAGE_BATCH_SIZE || '100', 10),
  tempDir: path.resolve(process.cwd(), process.env.TEMP_DIR || './analysis-data/temp'),
  maxConcurrentParses: parseInt(process.env.MAX_CONCURRENT_PARSES || '20', 10),
  ignorePatterns: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.next/**', // Next.js build output
    '**/.svelte-kit/**', // SvelteKit build output
    '**/.venv/**', // Python virtualenv
    '**/venv/**', // Python virtualenv
    '**/env/**', // Python virtualenv
    '**/__pycache__/**', // Python cache
    '**/*.pyc', // Python compiled files
    '**/bin/**', // Common build output (e.g., C#)
    '**/obj/**', // Common build output (e.g., C#)
    '**/*.class', // Java compiled files
    '**/target/**', // Java/Maven build output
    '**/*.log',
    '**/*.lock',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.test.tsx', // Ignore React test files
    '**/*.spec.tsx', // Ignore React spec files
    '**/*.test.js',  // Ignore JS test files
    '**/*.spec.js',  // Ignore JS spec files
    // '**/__tests__/**', // Line removed
    '**/playwright-report/**', // Ignore playwright report artifacts
    '**/public/**', // Ignore public assets directory

    '.DS_Store', // macOS specific
    ".cursor/**",
    ".idea/**",
    ".vs/**",
    ".vscode/**",
    "DerivedDataBuildWorker/**",
    "Design/**",
    "FeaturePacks/**",
    "OutSourceClient/**",
    "Samples/**",
    "Server/**",
    "Templates/**",
    "Tools/**",
    "Engine/Saved/**",
    "**/Intermediate/**",
    "**/Build/**",
    "**/Binaries/**",
    "Client/Content/**",
    "**/ThirdParty/**",
  
    "**/*.pyc",
    "**/bin/**",
    "**/obj/**",
    "**/*.class",
    "**/target/**",
    "**/*.log",
  ],
  supportedExtensions: [
 // Corrected array syntax
    // '.ts', '.tsx', '.js', '.jsx', // TS/JS/JSX
    // '.py',                       // Python
    // '.c', '.h', '.cpp', '.hpp', '.cc', '.hh' // C/C++
    // , '.java',                   // Java
    // '.cs',                       // C#
    // '.go',                       // Go
    // '.sql',                       // SQL
    ".cpp",".c",".h",".hpp",".cs",".lua",".cc",".hh"
  ],

};

// Basic validation (optional but recommended)
if (isNaN(config.storageBatchSize) || config.storageBatchSize <= 0) {
  console.warn(`Invalid STORAGE_BATCH_SIZE found, defaulting to 100. Value: ${process.env.STORAGE_BATCH_SIZE}`);
  config.storageBatchSize = 100;
}

// Validate maxConcurrentParses
if (isNaN(config.maxConcurrentParses) || config.maxConcurrentParses <= 0) {
  console.warn(`Invalid MAX_CONCURRENT_PARSES found, defaulting to 20. Value: ${process.env.MAX_CONCURRENT_PARSES}`);
  config.maxConcurrentParses = 20;
}

// Warn if concurrency is too high
if (config.maxConcurrentParses > 100) {
  console.warn(`MAX_CONCURRENT_PARSES is very high (${config.maxConcurrentParses}). This may cause "too many open files" errors.`);
}

export default config;
