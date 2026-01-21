import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'new_bombay_sweets';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Helper to get collection
async function getCollection(collectionName) {
  const client = await connectToDatabase();
  return client.db(DB_NAME).collection(collectionName);
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET handler
export async function GET(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    
    // GET /api/menu - Get all menu items
    if (path === 'menu' || path === '') {
      const collection = await getCollection('menuItems');
      const items = await collection.find({}).toArray();
      
      // Convert _id to string id
      const formattedItems = items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        isAvailable: item.isAvailable
      }));
      
      return NextResponse.json(formattedItems, { headers: corsHeaders });
    }
    
    // GET /api/menu/:id - Get single menu item
    if (path.startsWith('menu/')) {
      const id = path.split('/')[1];
      const collection = await getCollection('menuItems');
      const item = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      const formattedItem = {
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        isAvailable: item.isAvailable
      };
      
      return NextResponse.json(formattedItem, { headers: corsHeaders });
    }
    
    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST handler
export async function POST(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    
    // POST /api/menu - Create new menu item
    if (path === 'menu' || path === '') {
      const body = await request.json();
      const { name, category, price, description, image, isAvailable } = body;
      
      if (!name || !category || !price) {
        return NextResponse.json(
          { error: 'Name, category, and price are required' },
          { status: 400, headers: corsHeaders }
        );
      }
      
      const collection = await getCollection('menuItems');
      const newItem = {
        name,
        category,
        price: parseFloat(price),
        description: description || '',
        image: image || 'https://via.placeholder.com/300x200?text=Sweet',
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(newItem);
      
      return NextResponse.json(
        {
          id: result.insertedId.toString(),
          ...newItem
        },
        { status: 201, headers: corsHeaders }
      );
    }
    
    // POST /api/seed - Seed database with initial data
    if (path === 'seed') {
      const collection = await getCollection('menuItems');
      
      // Clear existing data
      await collection.deleteMany({});
      
      // Seed data
      const seedData = [
        // Indian Sweets
        {
          name: 'Kaju Katli',
          category: 'Indian Sweets',
          price: 450,
          description: 'Premium cashew fudge, thin and diamond-shaped, garnished with silver leaf',
          image: 'https://via.placeholder.com/300x200?text=Kaju+Katli',
          isAvailable: true
        },
        {
          name: 'Gulab Jamun',
          category: 'Indian Sweets',
          price: 50,
          description: 'Soft milk-solid balls deep-fried and soaked in rose-flavored sugar syrup',
          image: 'https://via.placeholder.com/300x200?text=Gulab+Jamun',
          isAvailable: true
        },
        {
          name: 'Rasgulla',
          category: 'Indian Sweets',
          price: 40,
          description: 'Spongy cottage cheese balls soaked in light sugar syrup',
          image: 'https://via.placeholder.com/300x200?text=Rasgulla',
          isAvailable: true
        },
        {
          name: 'Motichoor Laddu',
          category: 'Indian Sweets',
          price: 350,
          description: 'Round sweet balls made from fine boondi pearls, melts in mouth',
          image: 'https://via.placeholder.com/300x200?text=Motichoor+Laddu',
          isAvailable: true
        },
        {
          name: 'Milk Cake',
          category: 'Indian Sweets',
          price: 400,
          description: 'Rich and crumbly sweet made from solidified sweetened milk',
          image: 'https://via.placeholder.com/300x200?text=Milk+Cake',
          isAvailable: true
        },
        // Bengali Sweets
        {
          name: 'Rosogolla',
          category: 'Bengali Sweets',
          price: 45,
          description: 'Authentic Bengali spongy cottage cheese balls in sugar syrup',
          image: 'https://via.placeholder.com/300x200?text=Rosogolla',
          isAvailable: true
        },
        {
          name: 'Sandesh',
          category: 'Bengali Sweets',
          price: 380,
          description: 'Delicate sweet made from fresh cottage cheese, lightly sweetened',
          image: 'https://via.placeholder.com/300x200?text=Sandesh',
          isAvailable: true
        },
        {
          name: 'Chamcham',
          category: 'Bengali Sweets',
          price: 420,
          description: 'Cylindrical sweet made from chhena, coated with coconut',
          image: 'https://via.placeholder.com/300x200?text=Chamcham',
          isAvailable: true
        },
        {
          name: 'Mishti Doi',
          category: 'Bengali Sweets',
          price: 60,
          description: 'Sweet yogurt dessert, caramelized and fermented to perfection',
          image: 'https://via.placeholder.com/300x200?text=Mishti+Doi',
          isAvailable: true
        },
        // Snacks & Namkeen
        {
          name: 'Samosa',
          category: 'Snacks & Namkeen',
          price: 20,
          description: 'Crispy triangular pastry filled with spiced potatoes and peas',
          image: 'https://via.placeholder.com/300x200?text=Samosa',
          isAvailable: true
        },
        {
          name: 'Kachori',
          category: 'Snacks & Namkeen',
          price: 25,
          description: 'Flaky deep-fried snack filled with spiced lentils',
          image: 'https://via.placeholder.com/300x200?text=Kachori',
          isAvailable: true
        },
        {
          name: 'Namkeen Mixture',
          category: 'Snacks & Namkeen',
          price: 180,
          description: 'Crunchy blend of fried lentils, peanuts, and spices (per kg)',
          image: 'https://via.placeholder.com/300x200?text=Namkeen+Mixture',
          isAvailable: true
        },
        {
          name: 'Bhujia',
          category: 'Snacks & Namkeen',
          price: 200,
          description: 'Crispy noodle-like snack made from gram flour (per kg)',
          image: 'https://via.placeholder.com/300x200?text=Bhujia',
          isAvailable: true
        },
        // Chaat & Dishes
        {
          name: 'Pani Puri',
          category: 'Chaat & Dishes',
          price: 40,
          description: 'Crispy hollow puris filled with tangy tamarind water and potatoes',
          image: 'https://via.placeholder.com/300x200?text=Pani+Puri',
          isAvailable: true
        },
        {
          name: 'Dahi Puri',
          category: 'Chaat & Dishes',
          price: 50,
          description: 'Crispy puris topped with yogurt, chutneys, and sev',
          image: 'https://via.placeholder.com/300x200?text=Dahi+Puri',
          isAvailable: true
        },
        {
          name: 'Pav Bhaji',
          category: 'Chaat & Dishes',
          price: 80,
          description: 'Spicy mashed vegetable curry served with buttered bread rolls',
          image: 'https://via.placeholder.com/300x200?text=Pav+Bhaji',
          isAvailable: true
        },
        {
          name: 'Chole Bhature',
          category: 'Chaat & Dishes',
          price: 90,
          description: 'Spicy chickpea curry served with fluffy deep-fried bread',
          image: 'https://via.placeholder.com/300x200?text=Chole+Bhature',
          isAvailable: true
        },
        // Seasonal Specials
        {
          name: 'Gujiya',
          category: 'Seasonal Specials',
          price: 300,
          description: 'Crescent-shaped pastry filled with khoya and dry fruits (per kg)',
          image: 'https://via.placeholder.com/300x200?text=Gujiya',
          isAvailable: true
        },
        {
          name: 'Soan Papdi',
          category: 'Seasonal Specials',
          price: 320,
          description: 'Flaky crisp sweet with cardamom flavor that melts in mouth',
          image: 'https://via.placeholder.com/300x200?text=Soan+Papdi',
          isAvailable: true
        },
        {
          name: 'Dry Fruit Laddu',
          category: 'Seasonal Specials',
          price: 500,
          description: 'Premium laddus packed with almonds, cashews, and pistachios',
          image: 'https://via.placeholder.com/300x200?text=Dry+Fruit+Laddu',
          isAvailable: true
        }
      ];
      
      await collection.insertMany(seedData);
      
      return NextResponse.json(
        { message: 'Database seeded successfully', count: seedData.length },
        { headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT handler
export async function PUT(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    
    // PUT /api/menu/:id - Update menu item
    if (path.startsWith('menu/')) {
      const id = path.split('/')[1];
      const body = await request.json();
      
      const collection = await getCollection('menuItems');
      const updateData = {};
      
      if (body.name !== undefined) updateData.name = body.name;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.price !== undefined) updateData.price = parseFloat(body.price);
      if (body.description !== undefined) updateData.description = body.description;
      if (body.image !== undefined) updateData.image = body.image;
      if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;
      
      updateData.updatedAt = new Date();
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      const updatedItem = {
        id: result._id.toString(),
        name: result.name,
        category: result.category,
        price: result.price,
        description: result.description,
        image: result.image,
        isAvailable: result.isAvailable
      };
      
      return NextResponse.json(updatedItem, { headers: corsHeaders });
    }
    
    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE handler
export async function DELETE(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    
    // DELETE /api/menu/:id - Delete menu item
    if (path.startsWith('menu/')) {
      const id = path.split('/')[1];
      
      const collection = await getCollection('menuItems');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      
      return NextResponse.json(
        { message: 'Item deleted successfully' },
        { headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}