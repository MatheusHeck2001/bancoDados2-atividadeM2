import Synchronizer from "./Synchronizer/Synchronizer.js";
import MongoDbConnection from "./DatabaseConnection/MongoDbConnector.js";

let synchronizer = new Synchronizer();
let mongo = new MongoDbConnection();

async function main(){    
    // await synchronizer.synchronizeMySqlAndMongoDb();

    // await mongo.findAllEmployeesFromCurrentManager(110567, '');
    // await mongo.findAllEmployeesFromCurrentManager('', 'Leon');
    // await mongo.findAllEmployeesFromCurrentManager(110567, 'Oscar');
    // await mongo.findAllEmployeesLinkedToTitleAllTime('Senior Engineer');
    await mongo.findAllEmployeesLinkedToCurrentDept('d001');
    // await mongo.getAverageSalaryByDept('d001');
    // await mongo.getAverageSalaryByDept('d002');
    // await mongo.getAverageSalaryByDept('d003');
    // await mongo.getAverageSalaryByDept('d004');
    // await mongo.getAverageSalaryByDept('d005');
    // await mongo.getAverageSalaryByDept('d006');
    // await mongo.getAverageSalaryByDept('d007');
    // await mongo.getAverageSalaryByDept('d008');
    // await mongo.getAverageSalaryByDept('d009');
}

main();