const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

// Handle connection events
client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

client.on('end', () => {
    console.log('Redis client disconnected');
});

// Store OTP in Redis
const storedata = async (key, value) => {
    await client.set(key, value, 'EX', 300); // OTP expires after 5 minutes (300 seconds)
}

// Retrieve OTP from Redis
const getdata = async (key) => {
    return await client.get(key);
}

// Delete OTP from Redis after verification
const deletedata = async (key) => {
    await client.del(key);
}

// Export the Redis client and functions
module.exports = { client, storedata, getdata, deletedata };