import MongoDbConnection from "../DatabaseConnection/MongoDbConnector.js";
import MySqlConnection from "../DatabaseConnection/MySqlConnector.js";

const mySql = new MySqlConnection();
const mongoDb = new MongoDbConnection();

class Synchronizer {
    async synchronizeMySqlAndMongoDb(){    
        let employees = await mySql.findAllEmployees();
        for (let employee of employees) {
            let employeeCreated = await this.createEmployeeToMongoDb(employee.emp_no);
            mongoDb.insertDocument(employeeCreated);
        }
    }

    async createEmployeeToMongoDb(carId){
        let employee = await mySql.createEmployeeToInsert(carId);
        return employee;
    }
}

export default Synchronizer;

