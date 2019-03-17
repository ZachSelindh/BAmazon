/* Node.js file for BAmazon app - manager side for UTA Boot Camp
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
    showStore();
  });

function showStore() {
    inquirer
    .prompt([
      {
        name: "choose",
        type: "list",
        message: "Choose a management function:",
        choices: ["View Store", "View Low Inventory",
        "Replenish Inventory", "Add New Product", "Quit"]
      }
    ]).then(function(choice) {
        switch(choice.choose) {
            case "View Store":
                viewStore();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Replenish Inventory":
                replenish()
                break;
            case "Add New Product":
                addNew();
                break;
            case "Quit":
                console.log("Come back to work soon.");
                conn.end();
                break;
            default:
                break;
        };
    });
};

function viewStore() {
    conn.query("SELECT * FROM store", function(err, data) {
        if (err) throw err;
        for (i=0; i < data.length; i++) {
          console.log("ID: ".yellow + colors.green(data[i].id));
          console.log("Product: ".yellow + data[i].product_name.green);
          console.log("Department: ".yellow + data[i].department.green);
          console.log("Price: ".yellow + colors.green(data[i].price));
          console.log("Stock: ".yellow + colors.green(data[i].stock));
          console.log("----------".white);
        };
        showStore();
    });
};

function viewLow() {
    conn.query("SELECT * FROM store WHERE STOCK <= 10", function(err, data) {
        if (err) throw err;
        for (i=0; i < data.length; i++) {
          console.log("ID: ".yellow + colors.green(data[i].id));
          console.log("Product: ".yellow + data[i].product_name.green);
          console.log("Department: ".yellow + data[i].department.green);
          console.log("Price: ".yellow + colors.green(data[i].price));
          console.log("Stock: ".yellow + colors.green(data[i].stock));
          console.log("----------".white);
        };
        showStore();
    });
};

function replenish() {
    conn.query("SELECT * FROM store", function(err, data) {
        if (err) throw err;
        for (i=0; i < data.length; i++) {
          console.log("ID: ".yellow + colors.green(data[i].id));
          console.log("Product: ".yellow + data[i].product_name.green);
          console.log("Stock: ".yellow + colors.green(data[i].stock));
          console.log("----------".white);
        }
        inquirer
    .prompt([
      {
        message: "Please type the ID of the item you'd like to replenish.",
        name: "choice"
      },
      {
        message: "How many would you like to add to stock?",
        name: "quantity"
      }
    ]).then(function(answer) {
        var chosen = answer.choice;
        var stockRep = answer.quantity;
        var stockCur = data[chosen - 1].stock;
        var newStock = parseInt(stockCur) + parseInt(stockRep);
        conn.query("UPDATE store SET ? WHERE ?", [
            {
                stock: newStock
            },
            {
                id: chosen
            }
        ], function(err, data) {
            if (err) throw err;
            console.log("Stock replenished!");
            console.log("----------".white);
            showStore();
        });
    });
});
};

function addNew() {
    inquirer
    .prompt([
        {
            message: "Enter the name of the new product:",
            name: "product"
        },
        {
            message: "Choose the department:",
            name: "department",
            type: "list",
            choices: ["Electronics", "Games", "Consoles"]
        },
        {
            message: "Enter the item's price:",
            name: "price"
        },
        {
            message: "How many would you like to add?",
            name: "stock"
        }
    ]).then(function(answer) {
        conn.query("INSERT INTO store (product_name, department, price, stock) VALUES (?, ?, ?, ?)", [
            answer.product, answer.department, answer.price, answer.stock
        ], function(err, data) {
            if (err) throw err;
            console.log("Item successfully added!")
            console.log("----------".white);
            showStore();
        })

    })
};