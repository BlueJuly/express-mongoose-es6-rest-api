const mongoose = require('mongoose');
const Org = require('./org.model');

async function run() {
  try {
    await mongoose.connect('mongodb://localhost/mca', { server: { socketOptions: { keepAlive: 1 } } });
    mongoose.connection.on('error', () => {
      mongoose.connection.dropDatabase();
      throw new Error(`unable to connect to database: ${'mongodb://localhost/mca'}`);
    });
    const orgName = 'Mozzaz';
    const addUser = await Org.addUser(orgName, '5b6a6bedc508c03973e9302d');
    console.log(addUser);
    mongoose.connection.dropDatabase();
    return addUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
run();
