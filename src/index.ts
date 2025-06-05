// src/index.ts - Updated with listing details route
import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    try {
        const accommodations = await prisma.accommodation.findMany();
        res.render('home', {
            title: 'Booking Site - Find Your Perfect Stay',
            accommodations
        });
    } catch (error) {
        console.error('Error fetching accommodations:', error);

        res.status(500).render('error', {
            title: 'Server Error - Booking Site',
            error: process.env.NODE_ENV === 'development' ?
                (error instanceof Error ? error.message : String(error)) :
                'Something went wrong!'
        });
    }
});

// New route for listing details
app.get('/listings/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(404).render('404', {
                title: 'Page Not Found - Booking Site'
            });
        }

        const accommodation = await prisma.accommodation.findUnique({
            where: { id }
        });

        if (!accommodation) {
            return res.status(404).render('404', {
                title: 'Page Not Found - Booking Site'
            });
        }

        res.render('listing-details', {
            title: `${accommodation.title} - Booking Site`,
            accommodation
        });
    } catch (error) {
        console.error('Error fetching accommodation details:', error);
        res.status(500).render('error', {
            title: 'Server Error - Booking Site',
            error: process.env.NODE_ENV === 'development' ?
                (error instanceof Error ? error.message : String(error)) :
                'Something went wrong!'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found - Booking Site'
    });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Server Error - Booking Site',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;