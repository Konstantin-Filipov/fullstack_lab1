
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
        myTable.appendChild(newRow);

        const editRecipe = document.createElement("td")
        editRecipe.innerHTML = `<button type="Button">Edit</button>`;
        editRecipe.querySelector('button').addEventListener('click', function() {
            generateEditRecipeField(element);
        });
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

        
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------for edit functionality-----------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

function generateEditRecipeField(element) {
    // Disable the edit button
    const editButton = document.querySelector(`#recipe-${element._id} button`);
    editButton.disabled = true;

    // Create form elements
    const form = document.createElement('form');
    const titleInput = createInput('title', element.title);
    const ingridientsInput = createInput('ingridients', element.ingridients);
    const instructionsInput = createInput('instructions', element.instructions);
    const cookingTimeInput = createInput('cookingTime', element.cookingTime);

    // Append inputs and buttons to the form
    form.appendChild(titleInput);
    form.appendChild(ingridientsInput);
    form.appendChild(instructionsInput);
    form.appendChild(cookingTimeInput);

    // Create Save and Discard buttons
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.onclick = () => saveRecipeChanges(element._id, form); // Call a function to save changes when Save button is clicked

    const discardButton = document.createElement('button');
    discardButton.type = 'button';
    discardButton.textContent = 'Discard';
    discardButton.onclick = () => discardRecipeChanges(form, editButton); // Call a function to discard changes when Discard button is clicked

    // Append Save and Discard buttons to the form
    form.appendChild(saveButton);
    form.appendChild(discardButton);

    document.body.appendChild(form);
}

function createInput(name, value) {
    const input = document.createElement('input');
    if (name != "cookingTime"){
        input.type = 'text';
        input.name = name;
        input.value = value;
    }else{
        
        input.type = 'number';
        input.name = name;
        input.value = value;
    }
    return input;
}

//discard button 
function discardRecipeChanges(form,editButton) {
    //re-enable edit button
    editButton.disabled = false;

    // Remove the form from the DOM
    form.remove();
}

// Function to handle saving changes to the recipe
async function saveRecipeChanges(recipeId, form) {
    // Extract the updated data from the form
    const updatedRecipe = {
        title: form.querySelector('input[name="title"]').value,
        ingridients: form.querySelector('input[name="ingridients"]').value,
        instructions: form.querySelector('input[name="instructions"]').value,
        cookingTime: form.querySelector('input[name="cookingTime"]').value
    };

    // Update the UI and remove the form
    updateRecipeUI(recipeId, form, updatedRecipe);

    // Send a POST request to update the recipe on the backend
    await updateRecipe(recipeId, updatedRecipe);
}

// Function to update the UI and remove the form
function updateRecipeUI(recipeId, form, updatedRecipe) {
    // Update the row content with the new data
    const row = document.getElementById(`recipe-${recipeId}`);
    row.innerHTML = ''; // Clear existing content

    // Create new cell elements for the updated data
    const titleCell = document.createElement('td');
    titleCell.innerText = updatedRecipe.title;

    const ingridientsCell = document.createElement('td');
    ingridientsCell.innerText = updatedRecipe.ingridients;

    const instructionsCell = document.createElement('td');
    instructionsCell.innerText = updatedRecipe.instructions;

    const cookingTimeCell = document.createElement('td');
    cookingTimeCell.innerText = `${updatedRecipe.cookingTime} min`;

    // Append the new cells to the row
    row.appendChild(titleCell);
    row.appendChild(ingridientsCell);
    row.appendChild(instructionsCell);
    row.appendChild(cookingTimeCell);

    // Re-append the edit and delete buttons
    const editRecipe = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.innerText = "Edit";
    editButton.addEventListener("click", function() {
        generateEditRecipeField(updatedRecipe);
    });
    editRecipe.appendChild(editButton);
    row.appendChild(editRecipe);

    const deleteRecipe = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        showDeleteConfirmation(recipeId);
    };
    deleteRecipe.appendChild(deleteButton);
    row.appendChild(deleteRecipe);

    // Re-enable the edit button
    editButton.disabled = false;

    // Remove the form from the DOM
    form.remove();
}

//----------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------for delete functionality----------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------create recipe functionality-----------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
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

//-------------------------------------------------------------------------------------------------------------
//--------------------------------------------Controllers------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
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

async function updateRecipe(recipeId, updatedRecipe) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRecipe)
        });

        if (response.ok) {
            console.log(`Recipe with ID ${recipeId} updated successfully.`);
        } else {
            console.error(`Failed to update recipe with ID ${recipeId}.`);
        }
    } catch (error) {
        console.error(`Error updating recipe with ID ${recipeId}:`, error);
    }
}