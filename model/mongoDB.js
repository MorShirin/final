const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://morshirin23:59daJAH20rHceGRF@flights.piwctub.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

const connectToDatabase = async () => {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB Atlas');
  return client;
};



const closeDatabaseConnection = async (client) => {
  await client.close();
  console.log('Disconnected from MongoDB Atlas');
};


//login
const loginUser = async (username, password) => {
  const client = await connectToDatabase();

  try {
    const collection = client.db('flights').collection('customer');
    const user = await collection.findOne({ username });

    if (user && user.password === password) {
      return { message: 'Login successful!', user };
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed due to an internal error');
  } finally {
    await closeDatabaseConnection(client);
  }
};



// flight
const addNewFlight = async (flight) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('flight');
    const result = await collection.insertOne(flight);
    console.log('Flight added successfully!');
    return result;
  } catch (error) {
    console.error('Error adding flight:', error);
    throw new Error('Failed to add flight to the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};


const getFlight = async () => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('flight');
    const flights = await collection.find().toArray();
    return flights;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw new Error('Failed to retrieve flight data from the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};

const updateFlight = async (specific, discount) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('flight');

    const updatedFlights = await collection.find({ destination: specific }).toArray();

    for (const flight of updatedFlights) {
      const discountedPrice = flight.price * (1 - discount);

      await collection.findOneAndUpdate(
        { _id: flight._id },
        { $set: { price: discountedPrice } }
      );

      flight.price = discountedPrice; // Update the price in the response
    }

    return updatedFlights;
  } catch (error) {
    console.error('Error updating flights:', error);
    throw new Error('Failed to update flights in the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};

const updateAllFlight = async (discount) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('flight');

    const updatedFlights = await collection.find({}).toArray();

    for (const flight of updatedFlights) {
      const discountedPrice = flight.price * (1 - discount);

      await collection.findOneAndUpdate(
        { _id: flight._id },
        { $set: { price: discountedPrice } }
      );

      flight.price = discountedPrice; // Update the price in the response
    }

    return updatedFlights;
  } catch (error) {
    console.error('Error updating flight prices:', error);
    throw new Error('Failed to update flight prices in the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};




// opinion
const addNewOpinion = async (opinion) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('opinion');
    const result = await collection.insertOne(opinion);
    console.log('Opinion added successfully!');
    return result;
  } catch (error) {
    console.error('Error adding opinion:', error);
    throw new Error('Failed to add opinion to the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};


const getOpinion = async () => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('opinion');
    const opinions = await collection.find().toArray();
    return opinions;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw new Error('Failed to retrieve opinions from the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};


//user
const addNewUser = async (user) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('customer');
    const result = await collection.insertOne(user);
    console.log('User added successfully!');
    return result;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user to the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};



const deleteExistingUser = async (username) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('customer');
    const result = await collection.deleteOne({ username: username });
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user from the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};




const getUser = async () => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('customer');
    const users = await collection.find().toArray();
    return users;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw new Error('Failed to retrieve users from the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};




// coupon

const addNewCoupon = async (coupon) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('coupon');
    const result = await collection.insertOne(coupon);
    console.log('Coupon added successfully!');
    return result;
  } catch (error) {
    console.error('Error adding coupon:', error);
    throw new Error('Failed to add coupon to the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};


const getCoupon = async () => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection('coupon');
    const coupons = await collection.find().toArray();
    return coupons;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw new Error('Failed to retrieve coupons from the database');
  } finally {
    await closeDatabaseConnection(client);
  }
};

const getLastItem = async (collectionName) => {
  const client = await connectToDatabase();

  try {
    const database = client.db('flights');
    const collection = database.collection(collectionName);
    const lastItem = await collection.findOne({}, { sort: { _id: -1 } });
    return lastItem;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw new Error(`Failed to retrieve the last item from collection ${collectionName}`);
  } finally {
    await closeDatabaseConnection(client);
  }
};

module.exports = {
  loginUser,
  addNewFlight,
  getFlight,
  updateFlight,
  updateAllFlight,
  addNewOpinion,
  getOpinion,
  addNewUser,
  deleteExistingUser,
  getUser,
  addNewCoupon,
  getCoupon,
  getLastItem
};

run().catch(console.dir);