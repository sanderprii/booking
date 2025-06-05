import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'
import {exec} from 'child_process'
import {promisify} from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)
const prisma = new PrismaClient()

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Promisify the question method
const question = (query: string): Promise<string> =>
    new Promise(resolve => rl.question(query, resolve))

async function seedDatabase() {
    await prisma.accommodation.createMany({
        data: [
            {
                title: 'Cozy Downtown Apartment',
                description: 'A beautiful apartment in the heart of the city with modern amenities and great views.',
                price: 120,
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
            },
            {
                title: 'Luxury Beach House',
                description: 'Spacious beach house with private beach access, perfect for family vacations.',
                price: 350,
                image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop'
            },
            {
                title: 'Mountain Cabin Retreat',
                description: 'Peaceful cabin in the mountains, ideal for nature lovers and hiking enthusiasts.',
                price: 200,
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
            }
        ]
    })
}

async function main() {
    try {
        // Ask for confirmation
        const answer = await question('Do you really want to reset the database? (y/n): ')

        // Check if user confirmed
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
            return console.log('Database reset cancelled')
        }

        // Delete the SQLite database file if it exists
        // Extract database file path from DATABASE_URL environment variable
        const databaseUrl = process.env.DATABASE_URL || ''
        console.log(databaseUrl)
        const dbFilePath = databaseUrl.replace(/^file:/, '')
        const dbPath = path.resolve('prisma/'+ dbFilePath)

        if (fs.existsSync(dbPath)) {
            console.log(`Deleting existing database file at ${dbPath}...`)
            fs.unlinkSync(dbPath)
            console.log('Database file deleted successfully')
        } else {
            console.log('No existing database file found at ' +dbPath)
        }

        // Execute db push using bun
        console.log('Running prisma db push...')
        const {stdout, stderr} = await execAsync('bun prisma db push --accept-data-loss')

        if (stderr) {
            console.error('Error during db push:', stderr)
            process.exit(1)
        }

        console.log('Database schema updated successfully')
        console.log(stdout)

        // Proceed with seeding
        console.log('Seeding database...')
        await seedDatabase()
        console.log('Database seeded successfully')

    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    } finally {
        // Close the readline interface
        rl.close()
        await prisma.$disconnect()
    }
}

main().then(_r => console.log('Done'))
