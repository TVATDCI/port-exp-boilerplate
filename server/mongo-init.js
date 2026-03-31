// MongoDB initialization script
// This runs when the MongoDB container starts for the first time

db = db.getSiblingDB('portfolio');

// Create indexes for performance
db.projects.createIndex({ category: 1, featured: -1 });
db.projects.createIndex({ featured: -1 });
db.projects.createIndex({ createdAt: -1 });

db.contactmessages.createIndex({ read: 1, createdAt: -1 });
db.contactmessages.createIndex({ email: 1 });

print('Database initialized with indexes');
