/* Node.js file for BAmazon app - customer side for UTA Boot Camp
by Zach Selindh */

var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");

var conn = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

conn.connect(function(err) {
  if (err) throw err;
  initMarket();
});

function initMarket() {
  inquirer
  .prompt([
    {
      message: "Welcome! Would you like to see what we have for sale? yes or no",
      name: "welcome"
    }
  ]).then(function(answer){
    if (answer.welcome == "yes") {
      populateItems();
    } else if (answer.welcome == "no") {
      console.log("Thank you, come again!");
      conn.end();
    } else {
      console.log("Please enter either 'yes' or 'no'.");
      initMarket();
    }
  });
};

function populateItems() {
  conn.query("SELECT * FROM store", function(err, data) {
    if (err) throw err;
    for (i=0; i < data.length; i++) {
      console.log("ID: ".yellow + colors.green(data[i].id));
      console.log("Product: ".yellow + data[i].product_name.green);
      console.log("Department: ".yellow + data[i].department.green);
      console.log("Price: ".yellow + colors.green(data[i].price));
      console.log("Stock: ".yellow + colors.green(data[i].stock));
      console.log("----------".white);
    }
    getChoices();
  });
};

function getChoices() {
  inquirer
    .prompt([
      {
        message: "Please type the ID of the item you'd like to buy.",
        name: "choice"
      } ,
      {
        message: "How many would you like to buy?",
        name: "quantity"
      }
    ]).then(function(answer) {
      buyItems(answer.choice, answer.quantity);
    });
};


function buyItems(choice, quantity) {
  conn.query("SELECT * FROM store", function(err, data) {
    if (err) throw err;
    if (choice > data.length) {
      console.log("That item does not exist.");
      getChoices();
      return;
    }
    if (quantity > data[choice - 1].stock) {
      console.log("We don't have that many in stock.");
      getChoices();
    } else {
      var newStock = data[choice - 1].stock - quantity;
      conn.query("UPDATE store SET ? WHERE ?", [
        {
          stock: newStock
        },
        {
          id: choice
        }
      ], function(err, data) {
        if (err) throw err;
        console.log("Thank you for purchasing!");
        console.log("-------------");
        initMarket();
      });
    };
  });
};