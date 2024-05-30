const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const CustomerModel = require('./models/bucket');

//const username = prompt('What is your name? ');

//console.log(`Your name is ${username}`);

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    //console.log('Connected to MongoDB');
    await runQueries()
    await mongoose.disconnect();
    //console.log('Disconnected from MongoDB');
    process.exit();
}



const runQueries = async () => {
    console.log(`Welcome to the CRM.
    What would you like to do?
    1. Create a customer
    2. View all customers
    3. Update a customer
    4. Delete a customer
    5. quit`)
    const actionPrompt = prompt('Type number of desired action to run: ')
    console.log(`Your selection: ${actionPrompt}`)
    if (actionPrompt === '1') {
        await createCustomer();
    }
    if (actionPrompt === '2') {
        await getAllCustomers();

    }
    if (actionPrompt === '3') {
        await updateCustomer();
    }
    if (actionPrompt === '4') {
        await deleteCustomer();
    }
    if (actionPrompt === '5') {
        await exitApp();
    }
    else {
        console.log('Not a valid selection')
    }
};

async function createCustomer() {
    const newName = prompt('Customer name: ')
    const newAge = prompt('Customer age: ')
    const customerData = {
        name: newName,
        age: newAge
    }
    const customer = await CustomerModel.create(customerData)
    console.log("New customer: ", customer);
    await nextAction();
}

async function getAllCustomers() {
    const allCustomers = await CustomerModel.find({})
    console.log(`Below is a list of all customers: 
    `);
    allCustomers.forEach((customer) => {
        console.log(`id: ${customer._id} --- name: ${customer.name}, age: ${customer.age}`)
    })
    await nextAction();
}

async function updateCustomer() {
    await getAllCustomers();
    const id = prompt('What is the ID of the customer you wish to update? ')
    const newName = prompt('Updated customer name: ')
    const newAge = prompt('Updated customer age: ')
    const customer = await CustomerModel.findOneAndUpdate({ _id: id }, { name: newName, age: newAge }, { new: true })
    console.log('Updated customer info: ', customer)
    await nextAction();
}

async function deleteCustomer() {
    await getAllCustomers();
    const id = prompt('What is the ID of the customer you wish to delete? ')
    const customer = await CustomerModel.findOneAndDelete({ _id: id })
    console.log('Customer deleted.');
    await nextAction();
}

async function exitApp() {
    console.log('exiting...');
    process.exit();
}

async function nextAction() {
    console.log(`What would you like to do next?
    1. Return to main menu
    2. Quit`)
    const whatNext = prompt(`Your selection: `)
    console.log(`${whatNext}`)
    if (whatNext === '1') {
        await runQueries();
    }else if (whatNext === '2') {
        console.log('exiting...');
        process.exit();
    } else {
        console.log('Not a valid selection.');
        await nextAction()
    }
}

connect();