const grid = {};
document.addEventListener("DOMContentLoaded", () => {

    const deck = [
        "wood", "brick", "wheat", "stone", "glass",
        "wood", "brick", "wheat", "stone", "glass",
        "wood", "brick", "wheat", "stone", "glass"
    ];
    //shuffle and load deck for resource cards
    shuffle(deck);
    load_resources(deck);

    const cards = document.querySelectorAll(".resource");
    const gridCells = document.querySelectorAll(".grid-cell");
    let selectedCard = null;
    let selectedResource = null;
    let selectedCells = [];
    let resourceCardSelected = false;
    let cottagePlanSelected = false;
    let wellPlanSelected = false;
    let farmPlanSelected = false;
    let cathedralPlanSelected = false;
    let tavernPlanSelected = false;
    let marketPlanSelected = false;
    let chapelPlanSelected = false;
    let tradingPostPlanSelected = false;

    // Initialize grid dictionary with just resource = null 
    for (let i = 1; i <= 16; i++) {
        grid[`cell-${i}`] = null;
    }

    // Remove all active highlights
    // If a resource is selected, highlight empty cells.
    // If no resource is selected, allow hover selectablegrid to be visible on occupied cells.
    function updateGridHighlights() {
        // Remove 'active' from all cells first
        gridCells.forEach(cell => {
            cell.classList.remove("active");
            cell.classList.remove("selectablegrid");
            cell.classList.remove("selected");
            cell.classList.remove("selectable");
        });
        selectedCells = [];
        console.log("selected cells", selectedCells);
        // Decide what to highlight
        if (selectedResource) {
            // A resource card is selected then highlight empty cells
            gridCells.forEach(cell => {
                if (!cell.querySelector(".grid-resource")) {
                    if (grid[cell.id] != "cottage" && grid[cell.id] != "well" && 
                        grid[cell.id] != "farm" && grid[cell.id] != "cathedral" && 
                        grid[cell.id] != "tavern" && grid[cell.id] != "market" && 
                        grid[cell.id] != "chapel" && grid[cell.id] != "trading post") {
                    cell.classList.add("active");
                    }
                }
                resourceCardSelected = true;
                console.log("resource card selected", resourceCardSelected);
            });
        } else {
            // No resource card is selected then highlight occupied cells
            resourceCardSelected = false;
            console.log("resource card selected", resourceCardSelected);

            gridCells.forEach(cell => {
                if (cell.querySelector(".grid-resource")) {
                    cell.classList.add("selectablegrid");
                }
            });
        }
    }

    // Handle resource card clicks
    cards.forEach(card => {
        card.addEventListener("click", () => {
            // If there was a previously selected card deselect it
            if (selectedCard) {
                selectedCard.classList.remove("selected");
                console.log("deselected previous card");
            }

            // If this is a different card select it otherwise deselect all
            if (selectedCard !== card) {
                card.classList.add("selected");
                selectedCard = card;
                selectedResource = card.querySelector("h3").textContent;
                console.log("selected resource card:", selectedResource);
            } else {
                selectedCard = null;
                selectedResource = null;
                console.log("no resource card selected now");
            }

            // Update which cells are highlighted
            updateGridHighlights();
        });
    });

    gridCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (cottagePlanSelected) {
                handlePlanSelection(cell, "cottage", "rgb(139, 139, 255)");
            } else if (wellPlanSelected) {
                handlePlanSelection(cell, "well", "rgb(176, 176, 176)");
            } else if (farmPlanSelected) {
                handlePlanSelection(cell, "farm", "rgb(255, 0, 0)");
            } else if (cathedralPlanSelected) {
                handlePlanSelection(cell, "cathedral", "rgb(255, 46, 231)");
            } else if (tavernPlanSelected) {
                handlePlanSelection(cell, "tavern", "rgb(48, 130, 0)");
            } else if (marketPlanSelected) {
                handlePlanSelection(cell, "market", "rgb(231, 189, 0)");
            } else if (chapelPlanSelected) {
                handlePlanSelection(cell, "chapel", "rgb(255, 123, 0)");
            } else if (tradingPostPlanSelected) {
                handlePlanSelection(cell, "trading post", "rgb(0, 0, 0)");
            } else if (selectedResource && cell.classList.contains("active") && 
            grid[cell.id] != "cottage" && grid[cell.id] != "well" && 
            grid[cell.id] != "farm" && grid[cell.id] != "cathedral" && 
            grid[cell.id] != "tavern" && grid[cell.id] != "market" && 
            grid[cell.id] != "chapel" && grid[cell.id] != "trading post") {
                // Only place resource if we have a selected card AND this cell is "active"
                // Place resource in cell
                const resourceDiv = document.createElement("div");
                resourceDiv.classList.add("grid-resource", selectedResource);
                cell.appendChild(resourceDiv);
    
                console.log("Placed resource:", selectedResource, "in", cell.id);
    
                // Update grid dictionary and grid array with resource in right spot
                grid[cell.id] = selectedResource;
                console.log("grid", grid);
    
                // Rotate deck
                deck.push(selectedResource);
                const next_resource = deck.shift();
                selectedCard.querySelector("h3").textContent = next_resource;
                document.getElementById("resource" + selectedCard.id + "-material")
                    .classList.replace(selectedResource, next_resource);
    
                // Deselect the card
                selectedCard.classList.remove("selected");
                selectedCard = null;
                selectedResource = null;
    
                // Re-run highlight logic (no card is now selected)
                updateGridHighlights();
    
            } else if (cell.querySelector(".grid-resource")) {
                if (resourceCardSelected == false) {
                    // Check if the cell is already selected
                    if (!selectedCells.some(selectedCell => selectedCell.id === cell.id)) {
                        // Add 'selected' class to the cell
                        cell.classList.add("selected");
    
                        // Store the cell information in the selectedCells array
                        selectedCells.push({
                            id: cell.id,
                            resource: grid[cell.id]
                        });
                        console.log(selectedCells.length);
                        console.log("Selected cells:", selectedCells);
    
                    } else {
                        console.log("Cell is already selected:", cell.id);
                        cell.classList.remove("selected");
    
                        // Remove the cell from the selectedCells array
                        const index = selectedCells.findIndex(selectedCell => selectedCell.id === cell.id);
                        if (index !== -1) {
                            selectedCells.splice(index, 1);
                        }
    
                        console.log("Updated selected cells:", selectedCells);
                        console.log("grid", grid);
                    }
                }
                console.log("cottage status:", check_cottage());
                console.log("well status:", check_well());
                console.log("farm status:", check_farm());
                console.log("cathedral status:", check_cathedral());
                console.log("tavern status: ", check_tavern());
                console.log("market status:", check_market());
                console.log("chapel status:", check_chapel());
                console.log("trading post status: ", check_trading_post());
                console.log(grid);
    
                updatePlans();
            }
        });
    });
    
    
    
function handlePlanSelection(cell, planType, color) {
    console.log("selection function is running");
    // Check if the clicked cell is one of the selected cells
    let cellFound = false;
    for (let i = 0; i < selectedCells.length; i++) {
        if (selectedCells[i].id === cell.id) {
            cellFound = true;
            break;
        }
    }
    if (!cellFound) {
        console.log(`Cannot build ${planType} on this cell:`, cell.id);
        return;
    }
    // Change the background color of the selected grid cell
    cell.style.backgroundColor = color;
    console.log(`${planType.charAt(0).toUpperCase() + planType.slice(1)} built on cell:`, cell.id);
    resetPlanSelectionFlags();

    // Remove resources from selected cells
    selectedCells.forEach(selectedCell => {
        const cellElement = document.getElementById(selectedCell.id);
        cellElement.innerHTML = '';
        cellElement.classList.remove("selected");
        grid[selectedCell.id] = null;
        cellElement.classList.remove("selectablegrid");
    });
    console.log(grid);
    selectedCells = [];
    console.log("Resources removed from selected cells");
    updatePlans();
    grid[cell.id] = planType; // Update grid dictionary
    console.log(`grid after ${planType} built:`, grid);
}

function resetPlanSelectionFlags() {
    cottagePlanSelected = false;
    wellPlanSelected = false;
    farmPlanSelected = false;
    cathedralPlanSelected = false;
    tavernPlanSelected = false;
    marketPlanSelected = false;
    chapelPlanSelected = false;
    tradingPostPlanSelected = false;
}
    function updatePlans() {
        const plans = document.querySelectorAll(".plan");

        const cottagePlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Cottage ☘")
        );
        if (cottagePlan) {
            if (check_cottage()) {
                cottagePlan.classList.add("canbebuilt");
                console.log("cottage can be built");
            } else {
                cottagePlan.classList.remove("canbebuilt");
            }
        }

        const wellPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Well")
        );
        if (wellPlan) {
            if (check_well()) {
                wellPlan.classList.add("canbebuilt");
                console.log("well can be built");
            } else {
                wellPlan.classList.remove("canbebuilt");
            }
        }

        const farmPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Farm")
        );
        if (farmPlan) {
            if (check_farm()) {
                farmPlan.classList.add("canbebuilt");
                console.log("farm can be built");
            } else {
                farmPlan.classList.remove("canbebuilt");
            }
        }

        const cathedralPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Cathedral of Caterina")
        );
        if (cathedralPlan) {
            if (check_cathedral()) {
                cathedralPlan.classList.add("canbebuilt");
                console.log("cathedral can be built");
            } else {
                cathedralPlan.classList.remove("canbebuilt");
            }
        }

        const tavernPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Tavern")
        );
        if (tavernPlan) {
            if (check_tavern()) {
                tavernPlan.classList.add("canbebuilt");
                console.log("tavern can be built");
            } else {
                tavernPlan.classList.remove("canbebuilt");
            }
        }

        const marketPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Market")
        );
        if (marketPlan) {
            if (check_market()) {
                marketPlan.classList.add("canbebuilt");
                console.log("market can be built");
            } else {
                marketPlan.classList.remove("canbebuilt");
            }
        }

        const chapelPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Chapel")
        );
        if (chapelPlan) {
            if (check_chapel()) {
                chapelPlan.classList.add("canbebuilt");
                console.log("chapel can be built");
            } else {
                chapelPlan.classList.remove("canbebuilt");
            }
        }

        const tradingPostPlan = Array.from(plans).find(plan =>
            plan.querySelector(".plan-top h3").textContent.includes("Trading Post")
        );
        if (tradingPostPlan) {
            if (check_trading_post()) {
                tradingPostPlan.classList.add("canbebuilt");
                console.log("trading post can be built");
            } else {
                tradingPostPlan.classList.remove("canbebuilt");
            }
        }
    }

    // Add event listeners to all plans
    const plans = document.querySelectorAll(".plan");
    plans.forEach(plan => {
        const planName = plan.querySelector(".plan-top h3").textContent;
        plan.addEventListener("click", () => {
            console.log(`${planName} plan clicked`);
            switch (planName) {
                case "Cottage ☘":
                    cottagePlanSelected = check_cottage();
                    console.log("can you build cottage?" + cottagePlanSelected);
                    break;
                case "Well":
                    wellPlanSelected = check_well();
                    console.log("can you build well?" + wellPlanSelected);
                    break;
                case "Farm":
                    farmPlanSelected = check_farm();
                    console.log("can you build farm?" + farmPlanSelected);
                    break;
                case "Cathedral of Caterina":
                    cathedralPlanSelected = check_cathedral();
                    console.log("can you build cathedral?" + cathedralPlanSelected);
                    break;
                case "Tavern":
                    tavernPlanSelected = check_tavern();
                    console.log("can you build tavern?" + tavernPlanSelected);
                    break;
                case "Market":
                    marketPlanSelected = check_market();
                    console.log("can you build market?" + marketPlanSelected);
                    break;
                case "Chapel":
                    chapelPlanSelected = check_chapel();
                    console.log("can you build chapel?" + chapelPlanSelected);
                    break;
                case "Trading Post":
                    tradingPostPlanSelected = check_trading_post();
                    console.log("can you build trading post?" + tradingPostPlanSelected);
                    break;
                default:
                    break;
            }
        });
    });
    
    // Add event listener to Well plan
    const wellPlan = Array.from(document.querySelectorAll(".plan")).find(plan =>
        plan.querySelector(".plan-top h3").textContent.includes("Well")
    );
    if (wellPlan) {
        wellPlan.addEventListener("click", () => {
            console.log("Well plan clicked");
            if (check_well()) {
                wellPlanSelected = true; 
                console.log("can you build well?" + wellPlanSelected);
            } else {
                wellPlanSelected = false;   
                console.log("can you build well?" + wellPlanSelected);       
            }
        });
    }
    
    //checks if the well can be built with selected cells, same as cottage
    function check_well() {
        if (selectedCells.length != 2) {
            return false;
        }
        let stone_location = {};
        let wood_location = {};
        let has_stone = false;
        let has_wood = false;
    
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "stone") {
                stone_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_stone = true;
            }
            else if (temp_cell.resource == "wood") {
                wood_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_wood = true;
            }
        }
        if (!(has_stone && has_wood)) {
            return false;
        }
        if (stone_location.row == wood_location.row) {
            if (wood_location.col == stone_location.col + 1 || wood_location.col == stone_location.col - 1) {
                return true;
            }
        }
        else if (stone_location.col == wood_location.col) {
            if (wood_location.row == stone_location.row + 1 || wood_location.row == stone_location.row - 1) {
                return true
            }
        }
        return false;
    }


  
    // Shuffle function for the deck
    function shuffle(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * i);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Load initial resources onto the three face-up cards
    function load_resources() {
        const r1 = deck.shift();
        const r2 = deck.shift();
        const r3 = deck.shift();

        document.getElementById("resource1-text").textContent = r1;
        document.getElementById("resource2-text").textContent = r2;
        document.getElementById("resource3-text").textContent = r3;

        document.getElementById("resource1-material").classList.add(r1);
        document.getElementById("resource2-material").classList.add(r2);
        document.getElementById("resource3-material").classList.add(r3);
    }

    //checks if cottage can be built with selected cells
    function check_cottage() {
        // if not only 3 cells selected, cottage cant be built
        if (selectedCells.length != 3) {
            return false;
        }
        let brick_location = {};
        let glass_location = {};
        let wheat_location = {};
        let has_brick = false;
        let has_glass = false;
        let has_wheat = false;
        //making sure have exactly 1 brick wheat and glass and getting locations by row and col
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "brick") {
                brick_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_brick = true;
            }
            else if (temp_cell.resource == "glass") {
                glass_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_glass = true;
            }
            else if (temp_cell.resource == "wheat") {
                wheat_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_wheat = true;
            }
        }
        //if doesnt have all 3, cant build
        if (!(has_brick && has_glass && has_wheat)) {
            return false;
        }
        //this is checking the orientation: ex. if brick/glass stacked horizontally, glass wheat must be stacked vertically etc...
        if (brick_location.row == glass_location.row) {
            if (glass_location.col == brick_location.col + 1 || glass_location.col == brick_location.col - 1) {
                if (glass_location.col == wheat_location.col) {
                    if (wheat_location.row == glass_location.row + 1 || wheat_location.row == glass_location.row - 1) {
                        return true;
                    }
                }
            }
        }
        else if (brick_location.col == glass_location.col) {
            if (glass_location.row == brick_location.row + 1 || glass_location.row == brick_location.row - 1) {
                if (glass_location.row == wheat_location.row) {
                    if (wheat_location.col == glass_location.col + 1 || wheat_location.col == glass_location.col - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function check_farm() {
        // if not only 3 cells selected, cottage cant be built
        if (selectedCells.length != 4) {
            return false;
        }
        let wood_location_1 = {};
        let wood_location_2 = {};
        let wheat_location_1 = {};
        let wheat_location_2 = {};
        let wood_count = 0;
        let wheat_count = 0;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "wood") {
                if (wood_count == 0){
                    wood_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wood_count++;
                }
                else if (wood_count == 1){
                    wood_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wood_count++;
                }
                else{
                    console.log('error 5');
                    return false;
                }
            }
            else if (temp_cell.resource == "wheat") {
                if (wheat_count == 0){
                    wheat_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wheat_count++;
                }
                else if (wheat_count == 1){
                    wheat_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wheat_count++;
                }
                else{
                    return false;
                }
            }
        }
        if (!(wood_count == 2 && wheat_count == 2)) {
            return false;
        }
        if (wood_location_1.row == wood_location_2.row && difference(wood_location_1.col, wood_location_2.col) == 1 &&
        wheat_location_1.row == wheat_location_2.row && difference(wheat_location_1.col,wheat_location_2.col) == 1){
            if (difference(wood_location_1.row, wheat_location_1.row) == 1){
                if (are_sets_equal(new Set([wood_location_1.col, wood_location_2.col]), new Set([wheat_location_1.col, wheat_location_2.col]))){
                    return true;
                }
            }
        }
        else if(wood_location_1.col == wood_location_2.col && difference(wood_location_1.row, wood_location_2.row) == 1 &&
        wheat_location_1.col == wheat_location_2.col && difference(wheat_location_1.row, wheat_location_2.row) == 1){
            if (difference(wood_location_1.col, wheat_location_1.col) == 1){
                if (are_sets_equal(new Set([wood_location_1.row, wood_location_2.row]), new Set([wheat_location_1.row, wheat_location_2.row]))){
                    return true;
                }
            }
        }
        return false;
    }

    function check_cathedral() {
        if (selectedCells.length != 3) {
            return false;
        }
        let stone_location = {};
        let glass_location = {};
        let wheat_location = {};
        let has_stone = false;
        let has_glass = false;
        let has_wheat = false;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "stone") {
                stone_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_stone = true;
            }
            else if (temp_cell.resource == "glass") {
                glass_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_glass = true;
            }
            else if (temp_cell.resource == "wheat") {
                wheat_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_wheat = true;
            }
        }
        if (!(has_stone && has_glass && has_wheat)) {
            return false;
        }
        if (stone_location.row == glass_location.row) {
            if (glass_location.col == stone_location.col + 1 || glass_location.col == stone_location.col - 1) {
                if (glass_location.col == wheat_location.col) {
                    if (wheat_location.row == glass_location.row + 1 || wheat_location.row == glass_location.row - 1) {
                        return true;
                    }
                }
            }
        }
        else if (stone_location.col == glass_location.col) {
            if (glass_location.row == stone_location.row + 1 || glass_location.row == stone_location.row - 1) {
                if (glass_location.row == wheat_location.row) {
                    if (wheat_location.col == glass_location.col + 1 || wheat_location.col == glass_location.col - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function check_tavern(){
        if (selectedCells.length != 3){
            return false;
        }
        let brick_location_1 = {};
        let brick_location_2 = {};
        let glass_location = {};
        let brick_count = 0;
        let has_glass = false;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "brick") {
                if (brick_count == 0){
                    brick_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    brick_count++;
                }
                else if (brick_count == 1){
                    brick_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    brick_count++;
                }
            }
            else if (temp_cell.resource == "glass") {
                glass_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_glass = true;
            }
        }

        if (!(brick_count == 2 && has_glass)) {
            return false;
        }

        if (brick_location_1.row == brick_location_2.row && brick_location_1.row == glass_location.row){
            if (difference(brick_location_1.col, brick_location_2.col) == 1){
                if (difference(brick_location_1.col, glass_location.col) == 1 || difference(brick_location_2.col, glass_location.col) == 1){
                    return true;
                }
            }
        }
        else if (brick_location_1.col == brick_location_2.col && brick_location_1.col == glass_location.col){
            if (difference(brick_location_1.row, brick_location_2.row) == 1){
                if (difference(brick_location_1.row, glass_location.row) == 1 || difference(brick_location_2.row, glass_location.row) == 1){
                    return true;
                }
            }
        }
        return false;
    }

    function check_market(){
        if (selectedCells.length != 4){
            return false;
        }
        let stone_location_1 = {};
        let stone_location_2 = {};
        let glass_location = {};
        let wood_location = {};
        let stone_count = 0;
        let has_glass = false;
        let has_wood = false;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "stone") {
                if (stone_count == 0){
                    stone_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
                else if (stone_count == 1){
                    stone_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
            }
            else if (temp_cell.resource == "glass") {
                glass_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_glass = true;
            }
            else if(temp_cell.resource == "wood"){
                wood_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_wood = true;
            }
        }

        if (!(stone_count == 2 && has_glass && has_wood)) {
            return false;
        }

        if (glass_location.row == stone_location_1.row && glass_location.row == stone_location_2.row && glass_location.col == wood_location.col){
            if (difference(glass_location.col, stone_location_1.col) == 1 && difference(glass_location.col, stone_location_2.col) == 1 && difference(glass_location.row, wood_location.row) == 1){
                return true;
            }
        }
        else if (glass_location.col == stone_location_1.col && glass_location.col == stone_location_2.col && glass_location.row == wood_location.row){
            if (difference(glass_location.row, stone_location_1.row) == 1 && difference(glass_location.row, stone_location_2.row) == 1 && difference(glass_location.col, wood_location.col) == 1){
                return true;
            }
        }

        return false;
    }

    function check_chapel(){
        if (selectedCells.length != 4){
            return false;
        }
        let stone_location_1 = {};
        let stone_location_2 = {};
        let glass_location_1 = {};
        let glass_location_2 = {};
        let stone_count = 0;
        let glass_count = 0;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "stone") {
                if (stone_count == 0){
                    stone_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
                else if (stone_count == 1){
                    stone_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
            }
            else if (temp_cell.resource == "glass") {
                if (glass_count == 0){
                    glass_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    glass_count++;
                }
                else if (glass_count == 1){
                    glass_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    glass_count++;
                }
            }
        }

        if (!(stone_count == 2 && glass_count == 2)) {
            return false;
        }

        if (glass_location_1.row == stone_location_1.row && glass_location_1.row == stone_location_2.row){
            if (one_diff(glass_location_1.col, stone_location_1.col) && one_diff(glass_location_1.col, stone_location_2.col)){
                if ((stone_location_1.col == glass_location_2.col && one_diff(stone_location_1.row, glass_location_2.row)) ||
                (stone_location_2.col == glass_location_2.col && one_diff(stone_location_2.row, glass_location_2.row))){
                    return true;
                }
            }
        }
        else if(glass_location_2.row == stone_location_1.row && glass_location_2.row == stone_location_2.row){
            if (one_diff(glass_location_2.col, stone_location_1.col) && one_diff(glass_location_2.col, stone_location_2.col)){
                if ((stone_location_1.col == glass_location_1.col && one_diff(stone_location_1.row, glass_location_1.row)) ||
                (stone_location_2.col == glass_location_1.col && one_diff(stone_location_2.row, glass_location_1.row))){
                    return true;
                }
            }
        }
        else if(glass_location_1.col == stone_location_1.col && glass_location_1.col == stone_location_2.col){
            if (one_diff(glass_location_1.row, stone_location_1.row) && one_diff(glass_location_1.row, stone_location_2.row)){
                if ((stone_location_1.row == glass_location_2.row && one_diff(stone_location_1.col, glass_location_2.col)) ||
                (stone_location_2.row == glass_location_2.row && one_diff(stone_location_2.col, glass_location_2.col))){
                    return true;
                }
            }
        }
        else if(glass_location_2.col == stone_location_1.col && glass_location_2.col == stone_location_2.col){
            if (one_diff(glass_location_2.row, stone_location_1.row) && one_diff(glass_location_2.row, stone_location_2.row)){
                if ((stone_location_1.row == glass_location_1.row && one_diff(stone_location_1.col, glass_location_1.col)) ||
                (stone_location_2.row == glass_location_1.row && one_diff(stone_location_2.col, glass_location_1.col))){
                    return true;
                }
            }
        }
        return false;
    }

    function check_trading_post(){
        if (selectedCells.length != 5){
            return false;
        }
        let stone_location_1 = {};
        let stone_location_2 = {};
        let wood_location_1 = {};
        let wood_location_2 = {};
        let brick_location = {};
        let stone_count = 0;
        let wood_count = 0;
        let has_brick = false;
        for (let i = 0; i < selectedCells.length; i++) {
            const temp_cell = selectedCells[i];
            if (temp_cell.resource == "stone") {
                if (stone_count == 0){
                    stone_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
                else if (stone_count == 1){
                    stone_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    stone_count++;
                }
            }
            else if (temp_cell.resource == "wood") {
                if (wood_count == 0){
                    wood_location_1 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wood_count++;
                }
                else if (wood_count == 1){
                    wood_location_2 = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                    wood_count++;
                }
            }
            else if (temp_cell.resource == "brick"){
                brick_location = { row: parseInt(get_row(temp_cell.id)), col: parseInt(get_col(temp_cell.id)) };
                has_brick = true;
            }
        }

        if (!(stone_count == 2 && wood_count == 2 && has_brick)) {
            return false;
        }

        if (stone_location_1.col == stone_location_2.col && difference(stone_location_1.row, stone_location_2.row) == 1 &&
        wood_location_1.col == wood_location_2.col && difference(wood_location_1.row, wood_location_2.row) == 1){
            if (difference(stone_location_1.col, wood_location_1.col) == 1){
                if (are_sets_equal(new Set([stone_location_1.row, stone_location_2.row]), new Set([wood_location_1.row, wood_location_2.row]))){
                    if ((wood_location_1.row == brick_location.row && difference(wood_location_1.col, brick_location.col)==1) ||
                    (wood_location_2.row == brick_location.row && difference(wood_location_2.col, brick_location.col) == 1)){
                        return true;
                    }
                }
            }
        }
        else if (stone_location_1.row == stone_location_2.row && difference(stone_location_1.col, stone_location_2.col) == 1 &&
        wood_location_1.row == wood_location_2.row && difference(wood_location_1.col, wood_location_2.col) == 1){
            if (difference(stone_location_1.row, wood_location_1.row) == 1){
                if (are_sets_equal(new Set([stone_location_1.col, stone_location_2.col]), new Set([wood_location_1.col, wood_location_2.col]))){
                    if ((wood_location_1.col == brick_location.col && difference(wood_location_1.row, brick_location.row)==1) ||
                    (wood_location_2.col == brick_location.col && difference(wood_location_2.row, brick_location.row) == 1)){
                        return true;
                    }
                }
            }
        }

        return false;
    }
    }
);    

function get_row(cell_id) {
    return Math.ceil(cell_id.slice(5) / 4) - 1;
}

function get_col(cell_id) {
    return (cell_id.slice(5) - 1) % 4;
}

function are_sets_equal(set1, set2){
    if (set1.size != set2.size){
        return false;
    }

    for (let item of set1){
        if (!set2.has(item)){
            return false;
        }
    }
    return true;
}

function difference(item1, item2){
    return Math.abs(item1-item2);
}

function one_diff(item1, item2){
    return (Math.abs(item1-item2) == 1);
}

const resource_mapping = {
    "wood":"a",
    "brick":"b",
    "stone":"c",
    "glass":"d",
    "wheat":"e"
};
const building_mapping = {
    "cottage":"1",
    "farm":"2",
    "chapel":"3",
    "market":"4",
    "trading post":"5",
    "tavern": "6",
    "well": "7",
    "cathedral": "8"
};

function end_game(){
    game_state_end = '';
    for (let i = 1; i <= 16; i++){
        grid_key = "cell-" + i;
        grid_value = grid[grid_key];
        if (grid_value == null){
            game_state_end += "-";
        }
        else if (resource_mapping[grid_value]){
            game_state_end += resource_mapping[grid_value];
        }
        else if (building_mapping[grid_value]){
            game_state_end += building_mapping[grid_value];
        }
        else{
            game_state_end += "?"
        }
    }
    console.log(game_state_end);
    window.location.href = `/php/gameover.php?state=${game_state_end}`;
}

