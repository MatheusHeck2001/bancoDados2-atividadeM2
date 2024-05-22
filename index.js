import Synchronizer from "./Synchronizer/Synchronizer.js";
import MongoDbConnection from "./DatabaseConnection/MongoDbConnector.js";

let synchronizer = new Synchronizer();
let mongo = new MongoDbConnection();

async function main(){    
    synchronizer.synchronizeMySqlAndMongoDb();

    mongo.findAllEmployeesFromCurrentManager(110567);
    mongo.findAllEmployeesFromCurrentManager('Leon');
    mongo.findAllEmployeesLinkedToTitleAllTime('Senior Engineer');
    mongo.findAllEmployeesLinkedToCurrentDept('d001');
    mongo.getAverageSalaryByDept('d001');
    mongo.getAverageSalaryByDept('d002');
    mongo.getAverageSalaryByDept('d003');
    mongo.getAverageSalaryByDept('d004');
    mongo.getAverageSalaryByDept('d005');
    mongo.getAverageSalaryByDept('d006');
    mongo.getAverageSalaryByDept('d007');
    mongo.getAverageSalaryByDept('d008');
    mongo.getAverageSalaryByDept('d009');
}

main();