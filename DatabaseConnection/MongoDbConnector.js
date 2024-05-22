import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB_URI_CONNECTION = process.env.MONGODB_CONNECTION_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE_NAME;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION_NAME;

class MongoDbConnection {
    async insertDocument(obj) {
        let employee = obj;
        const mongodbConnection = new MongoClient(MONGODB_URI_CONNECTION);
        try {
            const database = mongodbConnection.db(MONGODB_DATABASE);
            const collection = database.collection(MONGODB_COLLECTION);
            let result = await collection.insertOne(employee);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        }
        catch (e) {
            console.error('Ocorreu um erro ao inserir um documento ao mongoDB', e);
        }
        finally {
            await mongodbConnection.close();
        }
    }

    async findAllEmployeesFromCurrentManager(searchItem) {
        const mongodbConnection = new MongoClient(MONGODB_URI_CONNECTION);
        let pipeline = [];
        if (typeof searchItem === 'number') {
            console.log('entered string')
            pipeline = [
                { $match: { 'currentManager.employee.emp_no': searchItem } }
            ];
        }
        else if (typeof searchItem === 'string') {
            console.log('entered number')

            pipeline = [
                { $match: { 'currentManager.employee.first_name': searchItem } }
            ];
        }

        try {
            const database = mongodbConnection.db(MONGODB_DATABASE);
            const collection = database.collection(MONGODB_COLLECTION);
            let aggCursor = collection.aggregate(pipeline);

            for await (const agg of aggCursor) {
                console.log(agg);
            }

        }
        catch (e) {
            console.error('aggregation error - findAllEmployeesFromCurrentManager', e);
        }

    }

    async findAllEmployeesLinkedToTitleAllTime(searchItem) {
        const mongodbConnection = new MongoClient(MONGODB_URI_CONNECTION);
        let pipeline = [
            { $match: { 'titles.title': searchItem } }
        ];

        try {
            const database = mongodbConnection.db(MONGODB_DATABASE);
            const collection = database.collection(MONGODB_COLLECTION);
            let aggCursor = collection.aggregate(pipeline);
            for await (const agg of aggCursor) {
                console.log(agg);
            }
        }
        catch (e) {
            console.error('aggregation error - findAllEmployeesLinkedToTitle', e);
        }

    }

    async findAllEmployeesLinkedToCurrentDept(searchItem) {
        const mongodbConnection = new MongoClient(MONGODB_URI_CONNECTION);
        let pipeline = [
            { $match: { 'currentDept.dept_no': searchItem } }
        ];

        try {
            const database = mongodbConnection.db(MONGODB_DATABASE);
            const collection = database.collection(MONGODB_COLLECTION);
            let aggCursor = collection.aggregate(pipeline);
            for await (const agg of aggCursor) {
                console.log(agg);
            }
        }
        catch (e) {
            console.error('aggregation error - findAllEmployeesLinkedToTitle', e);
        }

    }
    
    async getAverageSalaryByDept(dept_no) {
        const mongodbConnection = new MongoClient(MONGODB_URI_CONNECTION);

        let pipeline = [
            { $match: { 'currentDept.dept_no': dept_no } },
            { $group: { _id: '$currentDept.dept_no',
                        averageSalariesDept: { 
                            $avg: '$currentSalary.salary' } 
                        }
            }
        ];

        try {
            const database = mongodbConnection.db(MONGODB_DATABASE);
            const collection = database.collection(MONGODB_COLLECTION);
            let aggCursor = collection.aggregate(pipeline);

            for await (const agg of aggCursor) {
                console.log(agg);
            }
        }
        catch (e) {
            console.error('aggregation error - getAverageSalaryByDept', e);
        }

    }

}

export default MongoDbConnection;