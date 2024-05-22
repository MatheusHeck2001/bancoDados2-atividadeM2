import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const MYSQL_IP = process.env.MYSQL_DATABASE_IP;
const MYSQL_LOGIN = process.env.MYSQL_DATABASE_USER;
const MYSQL_PASSWORD = process.env.MYSQL_DATABASE_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE_NAME;
const PORT = process.env.MYSQL_PORT;

let mysqlConnection = mysql.createConnection({
    host: MYSQL_IP,
    port: PORT,
    user: MYSQL_LOGIN,
    password: MYSQL_PASSWORD,
    database: DATABASE
});

class MySqlConnection {
    async connectToMySQL() {
        return new Promise((resolve, reject) => {
            mysqlConnection.connect((err) => {
                if (err) {
                    console.error("ERR: Connect from MySQL failed ==> ", err);
                    reject(err);
                }
                else {
                    console.log("MySQL mysqlConnection established!");
                    resolve();
                }
            });
        });
    }

    async disconnectFromMySQL() {
        return new Promise((resolve, reject) => {
            mysqlConnection.end((err) => {
                if (err) {
                    console.error("ERR: Disconnect from MySQL failed ==> ", err);
                    reject(err);
                }
                else {
                    console.log("MySQL mysqlConnection closed!");
                    resolve();
                }
            })
        })
    }

    async findAllEmployees() {
        let query = `SELECT * FROM employees`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findAllEmployees =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findEmployeeById(id) {
        let query = `SELECT * FROM employees WHERE emp_no = ${id}`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findEmployeeById =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findSalariesById(id){
        let query = `SELECT * FROM salaries WHERE emp_no = ${id} ORDER BY to_date DESC`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findSalariesById =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findTitlesById(id){
        let query = `SELECT * FROM titles WHERE emp_no = ${id} ORDER BY to_date DESC`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findTitlesById =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findDeptEmpById(id){
        let query = `SELECT * FROM dept_emp WHERE emp_no = ${id} ORDER BY to_date DESC`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findDeptEmpById =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findDeptManagerById(id){
        let query = `SELECT * FROM dept_manager WHERE emp_no = ${id} ORDER BY to_date DESC`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findDeptManagerById =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findDepartmentByDeptEmployee(dept_id){
        let query = `SELECT * FROM departments WHERE dept_no like '${dept_id}'`;

        return new Promise((resolve, reject) => {
            mysqlConnection.query(query, (err, result) => {
                if (err) {
                    console.error("ERR: findDepartmentByDeptEmployee =>", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    async findActualManagerByDepartment(dept_no){
        let query = `SELECT * from dept_manager WHERE dept_no like '${dept_no}' 
            AND to_date = '9999-01-01'`;

            return new Promise((resolve, reject) => {
                mysqlConnection.query(query, (err, result) => {
                    if (err) {
                        console.error("ERR: findActualManagerByDepartment =>", err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

    }

    async createEmployeeToInsert(id){
        let employee = await this.findEmployeeById(id);         // employee infos
        let salaries = await this.findSalariesById(id);         // salaries that employee already had
        let titles = await this.findTitlesById(id);             // salaries that employee already had
        let dept_emp = await this.findDeptEmpById(id);
        let departments = dept_emp;                             // departments the employee already worked on
        let dept_manager = await this.findDeptManagerById(id);  // department the employee already was manager

        let currentSalary = {};                                 // current salary of employee
        let currentTitle = {};                                  // current title of employee
        let currentDept = {};                                   // current department of employee
        let currentManager = {};                                // current manager of the employee

        if(salaries[0].to_date.getFullYear() === 9999){         // takes the first object because the query is ordered DESC
            currentSalary = salaries[0];   
        }
        else{
            currentSalary = {};
        }

        if(titles[0].to_date.getFullYear() === 9999){            // takes the first object because the query is ordered DESC
            currentTitle = titles[0];
        }
        else{
            currentTitle = {};
        }

        if(dept_emp[0].to_date.getFullYear() === 9999){         // takes the first object because the query is ordered DESC
            currentDept = dept_emp[0];
        }
        else{
            currentDept = {};
        }

        console.log(typeof currentDept)
        if(Object.keys(currentDept).length === 0){              // if employee quited, currentDept will be empty
            currentManager = {};                                // so he won't have current manager
        }
        else{
            let managerDept = await this.findActualManagerByDepartment(currentDept.dept_no);
            let managerEmp = await this.findEmployeeById(managerDept[0].emp_no);
            currentManager.employee = managerEmp[0];
            currentManager.dept = managerDept[0];
        }

        return {employee: employee[0], 
            salaries: salaries,
            titles: titles,
            departments: departments,
            dept_manager: dept_manager,
            currentSalary: currentSalary,
            currentTitle: currentTitle,
            currentDept: currentDept,
            currentManager: currentManager
        };
    }
}

export default MySqlConnection;