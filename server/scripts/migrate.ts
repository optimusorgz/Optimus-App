const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
    try {
        console.log('Starting database migrations...');

        // Read schema file
        const schemaPath = path.join(__dirname, '../database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter((stmt: string) => stmt.trim().length > 0);

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await pool.query(statement);
        }

        console.log('✓ Database migrations completed successfully');

        // Seed Initial Categories
        console.log('Seeding initial categories...');
        const categories = [
            { name: 'Electronics', icon: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png' },
            { name: 'Fashion', icon: 'https://cdn-icons-png.flaticon.com/128/3050/3050253.png' },
            { name: 'Books', icon: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png' },
            { name: 'Sports', icon: 'https://cdn-icons-png.flaticon.com/128/857/857681.png' },
            { name: 'Rentals', icon: 'https://cdn-icons-png.flaticon.com/128/1584/1584808.png' },
            { name: 'Used', icon: 'https://cdn-icons-png.flaticon.com/128/3081/3081840.png' },
            { name: 'Home', icon: 'https://cdn-icons-png.flaticon.com/128/619/619153.png' },
            { name: 'Beauty', icon: 'https://cdn-icons-png.flaticon.com/128/2762/2762316.png' },
        ];

        for (const category of categories) {
            try {
                await pool.query(
                    'INSERT INTO categories (name, icon_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
                    [category.name, category.icon]
                );
                console.log(`  ✓ Created category: ${category.name}`);
            } catch (error) {
                console.log(`  - Category ${category.name} already exists`);
            }
        }

        console.log('✓ Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('✗ Migration failed:', errorMessage);
        process.exit(1);
    }
};

// Run migrations
runMigrations();
