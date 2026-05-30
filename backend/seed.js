require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const City = require('./models/City');
const Listing = require('./models/Listing');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    await User.deleteMany();
    await City.deleteMany();
    await Listing.deleteMany();

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@relocation.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create Cities
    const nyc = await City.create({
      name: 'New York City',
      overview: 'The city that never sleeps. A global hub for finance, culture, and art.',
      costOfLiving: 'High',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070',
      keyNeighborhoods: ['Manhattan', 'Brooklyn', 'Queens'],
      essentials: ['Subway card', 'Winter coat']
    });

    const austin = await City.create({
      name: 'Austin, TX',
      overview: 'Live music capital of the world, growing tech hub with a great food scene.',
      costOfLiving: 'Medium',
      imageUrl: 'https://images.unsplash.com/photo-1531218150217-5afc4a15e31f?q=80&w=2070',
      keyNeighborhoods: ['Downtown', 'Domain', 'South Congress'],
      essentials: ['Car', 'Summer clothes']
    });

    // Create Listings
    await Listing.insertMany([
      {
        title: 'Luxury Apartment in Manhattan',
        category: 'housing',
        location: 'Midtown Manhattan, NYC',
        description: '2 bed, 2 bath apartment with city views and doorman.',
        price: 4500,
        contactDetails: 'nyc_apartments@example.com',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
        cityId: nyc._id
      },
      {
        title: 'Brooklyn Tech High School',
        category: 'school',
        location: 'Brooklyn, NYC',
        description: 'Top-rated public high school focusing on STEM.',
        price: 0,
        contactDetails: 'admissions@bths.edu',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
        cityId: nyc._id
      },
      {
        title: 'Austin General Hospital',
        category: 'healthcare',
        location: 'Downtown Austin',
        description: 'State-of-the-art medical facility with top doctors.',
        price: 0,
        contactDetails: 'contact@austinhospital.com',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053',
        cityId: austin._id
      },
      {
        title: 'Modern House in The Domain',
        category: 'housing',
        location: 'The Domain, Austin',
        description: '3 bed, 2.5 bath house near tech company offices.',
        price: 3200,
        contactDetails: 'austin_homes@example.com',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
        cityId: austin._id
      }
    ]);

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
