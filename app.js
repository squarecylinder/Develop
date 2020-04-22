const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// Empty array to hold the users input obj
const employees = [];
//questions to ask the user about their team
const questions = [
    {
        type: "input",
        name: "name",
        message: "Enter an employee's name:"
    },
    {
        type: "input",
        name: "id",
        message: "Enter the employee's id:",
        validate: function validateId(id) {
            var isValid = !Number.isNaN(parseInt(id));
            return isValid || "The id must be a number!";
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's email:",
        validate: function validateEmail(email){
            var isValidEmail = email.match( /\S+@\S+\.\S+/);
            if(isValidEmail){
                return true;
            }
            return "The email must be valid";
        }
    },
    {
        type: "list",
        name: "role",
        message: "What role is this employee?",
        choices: ["Manager", "Engineer", "Intern"]
    }
]
//The main function for asking the user to input data
function userInput() {
    //prompting the user to answer questions from the question array
    inquirer.prompt(questions).then(function (response) {
        //taking in the response to see what role the user selected and changing questions based on the role
        switch (response.role) {
            case "Manager":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "officeNumber",
                        message: "Enter Manager's Office Number:"
                    }
                ]).then(function (data) {
                    //creating a new obj with user response
                    const manager = new Manager(response.name, response.id, response.email, data.officeNumber);
                    employees.push(manager);
                    console.log("Member added!");
                    //asking if the user wants to continue adding members
                    inquirer.prompt({
                        type: "list",
                        name: "add",
                        message: "Would you like to add more members?",
                        choices: ["Yes", "No"]
                    }).then(function (response){
                        //will call the userInput function again
                        if(response.add == "Yes"){
                            userInput();
                        }
                        //ends the function
                        else{
                            console.log("Your Team is complete!");
                            buildTeam();
                        }
                    });
                });
                break;
            case "Engineer":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "github",
                        message: "Enter Engineer's github:"
                    }
                ]).then(function (data) {
                    //creating a new obj with user response
                    const engineer = new Engineer(response.name, response.id, response.email, data.github);
                    employees.push(engineer);
                    console.log("Member added!"); 
                    inquirer.prompt({
                        type: "list",
                        name: "add",
                        message: "Would you like to add more members?",
                        choices: ["Yes", "No"]
                    }).then(function (response){
                        //will call the userInput function again
                        if(response.add == "Yes"){
                            userInput();
                        }
                        //ends the function
                        else{
                            console.log("Your Team is complete!");
                            buildTeam();
                        }
                    });
                });
                break;
            case "Intern":
                inquirer.prompt({
                    type: "input",
                    name: "school",
                    message: "Enter Intern's school:"
                }).then(function (data) {
                    //creating a new obj with user response
                    const intern = new Intern(response.name, response.id, response.email, data.school);
                    employees.push(intern);
                    console.log("Member added!");
                    inquirer.prompt({
                        type: "list",
                        name: "add",
                        message: "Would you like to add more members?",
                        choices: ["Yes", "No"]
                    }).then(function (response){
                        //will call the userInput function again
                        if(response.add == "Yes"){
                            userInput();
                        }
                        //ends the function
                        else{
                            console.log("Your Team is complete!");
                            buildTeam();
                        }
                    });
                });
                break;
        };
    });
}
userInput();
function buildTeam() {
    fs.writeFileSync(outputPath, render(employees), "utf-8");
}
