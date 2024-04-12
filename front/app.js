
window.onload = generateRecipeTable;
const infoDisplay = document.getElementById('recipe-creation-error');

async function generateRecipeTable() {
    let myTable = document.getElementById('recipe-table');
    myTable.innerHTML = `
        <tr><th colspan="6">Recipes</th></tr>
        <tr>
            <th>Title</th>
            <th>Ingridients</th>
            <th>Instructions</th>
            <th>Cooking Time</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>`;

    const data = await getRecipes()
    data.forEach(element => {
        let newRow = document.createElement("tr");
        newRow.id = `recipe-${element._id}`; // Set ID for the row
        Object.keys(element).forEach((key) => {
            if (key !== "_id") {
                if (key == "cookingTime"){
                    let cell = document.createElement("td");
                    let cookingTimeText = `${element[key]} min`;
                    cell.innerText = cookingTimeText;
                    newRow.appendChild(cell);
                }
                else{
                    let cell = document.createElement("td");
                    cell.innerText = String(element[key]);
                    newRow.appendChild(cell);
                }
            }
        });

        const editRecipe = document.createElement("td")
        editRecipe.innerHTML = `<button type="button" onclick="generateEditRecipeField(this)">Edit</button>`;
        newRow.appendChild(editRecipe);

        const deleteRecipe = document.createElement("td")
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function() {
            showDeleteConfirmation(element._id);
        };
        deleteRecipe.appendChild(deleteButton);
        newRow.appendChild(deleteRecipe);

        myTable.appendChild(newRow);
    });
}

let isConfirmationWindowOpen = false; //flag for confirmation window 

function showDeleteConfirmation(recipeId) {
    // Create delete confirmation window
    if (!isConfirmationWindowOpen) {
        // Create delete confirmation window
        const confirmationWindow = document.createElement("div");
        confirmationWindow.className = "confirmation-window";
        confirmationWindow.innerHTML = `
            <p>Are you sure you want to delete this recipe?</p>
            <button class="cancel-button" onclick="closeConfirmationWindow()">Cancel</button>
            <button class="delete-button" onclick="deleteRecipe('${recipeId}')">Delete</button>
        `;
        document.body.appendChild(confirmationWindow);
        
        // Set the flag to indicate that the confirmation window is open
        isConfirmationWindowOpen = true;
    }
}

function closeConfirmationWindow() {
    const confirmationWindow = document.querySelector(".confirmation-window");
    if (confirmationWindow) {
        confirmationWindow.remove();
    }
    //set confirmation window flag to false
    isConfirmationWindowOpen = false;
}


async function createRecipe(){
    let recipeTitle = document.getElementById("input-recipe-title").value
    let recipeIngridients = document.getElementById("input-recipe-ingridients").value
    let recipeInstructions = document.getElementById("input-recipe-instructions").value
    let recipeCookingTime = document.getElementById("input-recipe-cookingTime").value
    
    if (recipeTitle != "" && recipeIngridients != "" && recipeInstructions != "" && recipeCookingTime != null){
        infoDisplay.innerHTML = "Recipe created!"
        console.log("Recipe Created!")
        console.log(`Recipe title: ${recipeTitle}`)
        console.log(`Recipe ingridients: ${recipeIngridients}`)
        console.log(`Recipe instructions: ${recipeInstructions}`)
        console.log(`Recipe cookingTime: ${recipeCookingTime}`)

        // Generate a new ObjectId for _id field
        ;
        // Create an object with the recipe data
        const recipeBody = {
            title: recipeTitle,
            ingridients: recipeIngridients,
            instructions: recipeInstructions,
            cookingTime: recipeCookingTime
        };

        try{
            // postAlbum function with the recipe data
            const response = await postRecipe(recipeBody);
            if (response.status === 201) {
                console.log("Recipe successfully created!");
                
                //update render state of the recipes list on the screen 
                await generateRecipeTable();
    
            } else {
                const data = await response.json();
                infoDisplay.innerHTML = data.error || "Error creating the recipe.";
                console.error("Error creating the recipe in else :", data.error || response.statusText);
            }
        }catch (error){
            console.error("Error creating recipe in catch:", error);
            infoDisplay.innerHTML = "Error creating the recipe in catch.";
        }

        //clear input fields after creating the recipe
        document.getElementById("input-recipe-title").value = "";
        document.getElementById("input-recipe-ingridients").value = "";
        document.getElementById("input-recipe-instructions").value = "";
        document.getElementById("input-recipe-cookingTime").value = null;

    }
    else{
        infoDisplay.innerHTML = "Please fill in all fields"
    }
}

//--------------controllers--------------
async function getRecipes() {
    return await fetch('api/recipes/')
        .then(response => response.json());
}

async function deleteRecipe(recipeId) {
    try {
        await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE'
        });
        // Remove the corresponding row from the table
        const rowToDelete = document.getElementById(`recipe-${recipeId}`);
        if (rowToDelete) {
            rowToDelete.remove();
        }
        // Close the confirmation window
        closeConfirmationWindow();
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
}

async function postRecipe(recipeBody){
    try{
        const response = await fetch(`api/recipes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeBody)
        });
        return response;
    }catch (error) {
        console.error("Error creating recipe in postRecipe function:", error);
        throw error;
    }
}