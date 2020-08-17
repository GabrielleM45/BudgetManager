// ======================
// VARIABLES
// ======================`

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = localStorage.getItem("lastID") || 0;


// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID

//ES5:
//is ES6 ready*/ 
// const updateStorage = function() {
//     localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
//     localStorage.setItem("lastID", lastID);
// }
//SCOPED arrow function*/
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID);
}


// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):
// const renderItems = function(items)<-pre arrow

const renderItems = items => {
    //if a different items array is passed in then use that or if NO items array is passed in then default and use budget items*/
    if (!items) items = budgetItems;
    const tbody = $("#budgetItems tbody");
    tbody.empty(); // this will empty the set and add the new and old*/
    let total = 0;
    //this is the ES6 way:*/
    for (const { id, date, name, category, amount, notes }
        of items) {
        tbody.append(`<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`);

        total += parseFloat(amount); //every loop through would keep adding and adding



        // tbody.append(`<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${amount}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`); //** another way without going out to decimals */
    }
    // for (const item of items) {
    //     const { id, date, name, category, amout, notes }  = item;


    //rewrite the total calculation using an array reduce
    $("#total").text(`$${total.toFixed(2)}`)


}




//This is the long way:
//give the first variable the individual name of the groups your looking at*/
// for (const item of items) {
//                // tbody.append(`<tr data-id=${item.id}><td>${item.date}</td><td>${item.name}</td><td>${item.category}</td><td>$${item.amount}</td><td>${item.notes}</td><td class="delete"><span>x</span></td></tr>`);





// ======================
// MAIN PROCESS
// ======================

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").click(function() {
    $("#addItemForm").toggle("slow", function() {
        $("#toggleFormButton").text($(this).is(":visible") ? "Hide Form" : "Add New Budget Item")


        // if ($(this).is(":visible")) {
        //     $("#toggleFormButton").text("Hide Form");
        // } else {
        //     $("#toggleFormButton").text("Add New Budget Item");

        // }
    });
});

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array (each item's object should include: id / date / name / category / amount / notes)... then clear the form fields and trigger localStorage update/budgetItems rerender functions, once created
$("#addItem").click(function(event) {
    event.preventDefault();

    const newItem = {
        id: ++lastID,
        date: moment().format("lll"),
        name: $("#name").val().trim(), //removes spaces before or after*/
        category: $("#category").val().trim(), //removes spaces before or after*/
        amount: $("#amount").val().trim(),
        notes: $("#notes").val().trim() //removes spaces before or after*/


    };

    if (!newItem.name || !newItem.category || !newItem.amount) {
        return alert("Each budget item must have a valid name, category, and amount!")

    }
    // $("input, select").val(""); one way to clear the form*/
    console.log(newItem);
    budgetItems.push(newItem);
    $("#addItemForm form")[0].reset() // when jquery is combined w/ js need to specify the array thus the [0]*/
        //TODO: Update Storage
    updateStorage();
    //TODO: Rerender Items
    renderItems();



})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection

$("#categoryFilter").change(function() {
    const category = $(this).val();
    if (category) {
        const filteredItems = budgetItems.filter(item => category === item.category);
        renderItems(filteredItems);
    } else {
        renderItems();
    }


});




// const filteredItems = budgetItems.filter(function(item) {
//     return category === item.category;
// })




// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem


$("#budgetItems").on("click ", ".delete ", function() {
    const id = $(this).parents("tr").data("id");
    const remainingItems = budgetItems.filter(item => item.id !== id);
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $("#categoryFilter").val("");

    // /bad idea type of onclick
    // $(document).on("click", ".delete", function() {
    //     const id = $(this).parents("tr").data("id");
});

//called immediately on page to get initial render
renderItems();