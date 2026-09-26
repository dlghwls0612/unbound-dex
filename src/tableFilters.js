function returnAllORfilterValuefromLabel(label){
    let activeORfilterArray = []
    const activeFilter = document.getElementsByClassName("activeFilter")[0]
    const labelFilterContainer = activeFilter.getElementsByClassName(`${activeFilter.id}${label}Container`.replaceAll(" ", ""))[0]
    for (let i = 0; i < labelFilterContainer.children.length; i++){
        if (labelFilterContainer.children[i].children[0].value == "OR"){
            activeORfilterArray.push((labelFilterContainer.children[i].children[1].innerText.split(":")[1].replaceAll(" ", "")))
        }
    }

    return activeORfilterArray
}

function reverseFilter(filterString, trackerFilter){
    if (trackerFilter.includes(filterString)){
        for(let k = 0; k < trackerFilter.length; k++){
            if(trackerFilter[k] == filterString){
                trackerFilter.splice(k, 1)
            }
        }
    }
    else{
        trackerFilter.push(filterString)
    }

    return trackerFilter
}

function filterLogicalConnector(trackerFilter, value, label, operator, passed){
    if (operator == "OR"){
        let i = 0
        for (i = 0; i < trackerFilter.length; i++){
            if (new RegExp(`^OR_${label}`).test(trackerFilter[i])){
                if (!passed){
                    trackerFilter[i] += `/${value}@FAIL`
                }
                else{
                    trackerFilter[i] += `/${value}@OK`
                }
                break
            }
        }

        if (i == trackerFilter.length){
            trackerFilter.push(`OR_${label}`)
            if (!passed){
                trackerFilter[i] += `/${value}@FAIL`
            }
            else{
                trackerFilter[i] += `/${value}@OK`
            }
        }
    }
    else if ((!passed && operator == "AND") || (passed && operator == "NOT")){
        trackerFilter.push(`filter${label}${value}`)
    }
    else if (!passed && operator == "NOT"){
        for(let k = 0; k < trackerFilter.length; k++){
            if(trackerFilter[k] == `filter${label}${value}`){
                trackerFilter.splice(k, 1)
            }
        }
    }

    return trackerFilter
}

function updateORinTracker(value, label){
    const activeORfilterArray = returnAllORfilterValuefromLabel(label)
    for (let i = 0; i < tracker.length; i++){
        for (let j = 0; j < tracker[i]["filter"].length; j++){
            if (new RegExp(`^OR_${label}`).test(tracker[i]["filter"][j])){
                if (activeORfilterArray.length == 0){
                    tracker[i]["filter"].splice(j, 1)
                }
                else{
                    tracker[i]["filter"][j] = tracker[i]["filter"][j].replaceAll(new RegExp(`/${value}@FAIL|/${value}@OK`, "g"), "")
                }
            }
        }
    }
}

function passAllFilters(filterArray){
    for (let i = 0; i < filterArray.length; i++){
        if (!filterArray[i].includes("@OK")){
            return false
        }
    }

    return true
}







function filterSpeciesForm(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = true
        let name = tracker[i]["key"]
        if(tracker === locationsTracker){
            name = tracker[i]["key"].split("\\")[2]
        }
        if(value === "Mega"){
            if(!/_MEGA$|_MEGA_Y$|_MEGA_X$/i.test(name)){
                passed = false
            }
        }
        else if(value === "Alolan"){
            if(!/_A$/i.test(name) || /UNOWN/i.test(name)){
                passed = false
            }   
        }
        else if(value === "Galarian"){
            if(!/_G$|PERRSERKER$|SIRFETCHD$|MR_RIME$|CURSOLA$|OBSTAGOON$|RUNERIGUS$/i.test(name) || /UNOWN/i.test(name)){
                passed = false
            }   
        }
        else if(value === "Hisuian"){
            if(!/_H$|OVERQWIL$|SNEASLER$|BASCULEGION$/i.test(name) || /UNOWN/i.test(name)){
                passed = false
            }   
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterSpeciesItem(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = true
        let name = tracker[i]["key"]
        if(tracker === locationsTracker){
            name = tracker[i]["key"].split("\\")[2]
        }
        if(!(sanitizeString(species[name]["item1"]) === value) && !(sanitizeString(species[name]["item2"]) === value)){
            passed = false
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterSpeciesAbility(value = "Placeholder", label = "Placeholder", operator){
    let abilityName = null
    Object.keys(abilities).forEach(ability => {
        if(abilities[ability]["ingameName"] === value){
            abilityName = ability
        }
    })
    if(abilityName){
        for(let i = 0, j = tracker.length; i < j; i++){
            let passed = true
            let name = tracker[i]["key"]
            if(tracker === locationsTracker){
                name = tracker[i]["key"].split("\\")[2]
            }
            if(!species[name]["abilities"].includes(abilityName)){
                if(typeof innatesDefined !== "undefined"){
                    if(!species[name]["innates"].includes(abilityName)){
                        passed = false
                    }
                }
                else{
                    passed = false
                }
            }

            tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
        }
    }
}

function filterSpeciesMove(value, label, operator){
    let moveName = null
    Object.keys(moves).forEach(move => {
        if(moves[move]["ingameName"] === value){
            moveName = move
        }
    })
    if(moveName){
        for(let i = 0, j = tracker.length; i < j; i++){
            let passed = true
            let name = tracker[i]["key"]
            if(tracker === locationsTracker){
                name = tracker[i]["key"].split("\\")[2]
            }
            if(speciesCanLearnMove(species[name], moveName) === false){
                passed = false
            }

            tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
        }
    }

    if (tracker == speciesTracker){
        let sortTable = false
        if (speciesMoveFilter == null){
            sortTable = true
        }
        updateSpeciesMoveFilter(sortTable)
    }
    else if (tracker == locationsTracker){
        updateLocationsMoveFilter()
    }
}

function filterSpeciesEggGroup(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = true
        let name = tracker[i]["key"]
        if(tracker === locationsTracker){
            name = tracker[i]["key"].split("\\")[2]
        }
        if(!(sanitizeString(species[name]["eggGroup1"]) === value) && !(sanitizeString(species[name]["eggGroup2"]) === value)){
            passed = false
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterType(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = true
        let name = tracker[i]["key"]
        if(tracker === locationsTracker){
            name = tracker[i]["key"].split("\\")[2]
        }
        if(tracker == speciesTracker || tracker == locationsTracker){
            if(typeof species[name]["type3"] !== "undefined"){
                if(!(sanitizeString(species[name]["type1"]) === value) && !(sanitizeString(species[name]["type2"]) === value) && !(sanitizeString(species[name]["type3"]) === value)){
                    passed = false
                }
            }
            else if(!(sanitizeString(species[name]["type1"]) === value) && !(sanitizeString(species[name]["type2"]) === value)){
                passed = false
            }
        }
        else if(tracker == movesTracker){
            if(!(sanitizeString(moves[name]["type"]) === value)){
                passed = false
            }   
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterMovesSplit(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = true
        let name = tracker[i]["key"]
        if(!(sanitizeString(moves[name]["split"]) === value)){
            passed = false
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterMovesFlags(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = false
        let name = tracker[i]["key"]
        for(let k = 0; k < moves[name]["flags"].length; k++){
            if(sanitizeString(moves[name]["flags"][k]) === value){
                passed = true
                break
            }   
        }

        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterMovesTarget(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        let passed = false
        let name = tracker[i]["key"]
        if(sanitizeString(moves[name]["target"]) === value){
            passed = true
        }   
        
        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
    }
}

function filterBaseStats(value, label){
    if(value === "HP"){
        value = "baseHP"
        label = "HP"
    }
    else if(value === "Atk"){
        value = "baseAttack"
        label = "Atk"
    }
    else if(value === "Def"){
        value = "baseDefense"
        label = "Def"
    }
    else if(value === "SpA"){
        value = "baseSpAttack"
        label = "SpA"
    }
    else if(value === "SpD"){
        value = "baseSpDefense"
        label = "SpD"
    }
    else if(value === "Spe"){
        value = "baseSpeed"
        label = "Speed"
    }
    else if(value === "BST"){
        value = "BST"
        label = "BST"
    }

    filterOperators(value, label, species)
}




























function selectFilter(value, label, operator = "AND"){
    if(label === "Item"){
        if(tracker === trainersTracker){
            trainerSpeciesMatchFilter(true)
        }
        else{
            filterSpeciesItem(value, label, operator)
        }
    }
    else if(label === "Move"){
        if(tracker === trainersTracker){
            trainerSpeciesMatchFilter(true)
        }
        else{
            filterSpeciesMove(value, label, operator)
        }
    }
    else if(label === "Type"){
        filterType(value, label, operator)
    }
    else if(label === "Ability"){
        if(tracker === trainersTracker){
            trainerSpeciesMatchFilter(true)
        }
        else{
            filterSpeciesAbility(value, label, operator)
        }
    }
    else if(label === "Egg Group"){
        filterSpeciesEggGroup(value, label, operator)
    }
    else if(label === "Form"){
        filterSpeciesForm(value, label, operator)
    }
    else if(label === "Split"){
        filterMovesSplit(value, label, operator)
    }
    else if(label === "Base Stats"){
        filterBaseStats(value, label, operator)
    }
    else if(label === "Flag"){
        filterMovesFlags(value, label, operator)
    }
    else if(label === "Target"){
        filterMovesTarget(value, label, operator)
    }
    else if(label === "Pocket"){
        filterPocket(value, label, operator)
    }
}






async function setFilters(){
    document.querySelectorAll(".tableFilter").forEach(el => {
        el.remove()
    })

    createFilterGroup(["Mega", "Alolan", "Galarian", "Hisuian"], "Form", [speciesFilterList, locationsFilterList])
    createFilterGroup(createFilterArray(["type"], moves), "Type", [speciesFilterList, movesFilterList, locationsFilterList])
    createFilterGroup(createFilterArray(["split"], moves), "Split", [movesFilterList])
    createFilterGroup(createFilterArray(["flags"], moves), "Flag", [movesFilterList])
    createFilterGroup(createFilterArray(["target"], moves), "Target", [movesFilterList])
    createFilterGroup(createFilterArray(["item1", "item2"], species), "Item", [speciesFilterList, locationsFilterList])
    try{
        createFilterGroup(Array.from(new Set(JSON.stringify(trainers).match(/ITEM_\w+/g).map(value => sanitizeString(value)))), "Item", [trainersFilterList])
    }
    catch{
        
    }
    createFilterGroup(createFilterArray(["ingameName"], abilities, false), "Ability", [speciesFilterList, locationsFilterList, trainersFilterList])
    createFilterGroup(createFilterArray(["ingameName"], moves, false), "Move", [speciesFilterList, locationsFilterList, trainersFilterList])
    createFilterGroup(createFilterArray(["eggGroup1", "eggGroup2"], species), "Egg Group", [speciesFilterList, locationsFilterList])
    createFilterGroup(["HP", "Atk", "Def", "SpA", "SpD", "Spe", "BST"], "Base Stats", [speciesFilterList, locationsFilterList], true)
}











































function filterList(){
    const activeFilter = document.getElementsByClassName("activeFilter")[0]
    const filters = activeFilter.getElementsByClassName("tableFilter")
    
    for(let i = 0; i < filters.length; i++){
        filters[i].classList.add("hide")
    }

    document.getElementsByClassName("activeInput")[0].value = ""


    for(let i = 0, j = Object.keys(tracker).length; i < j; i++){
        tracker[i]["filter"] = tracker[i]["filter"].filter(value => value !== "input")
    }
}






function createFilterGroup(values, labelValue, tableFilterListArray, operator = false){
    for(let i = 0; i < tableFilterListArray.length; i++){
        const mainContainer = document.createElement("div")
        values.forEach(value => {
            const container = document.createElement("span")
            const label = document.createElement("span")
            const valueContainer = document.createElement("span")

            label.innerText = `${labelValue}: `
            label.className = `${labelValue.replaceAll(" ", "")}`

            container.className = `tableFilter hide`

            valueContainer.innerText = value
            valueContainer.className = "filterValue"
            if(labelValue.includes("Type")){
                valueContainer.className = `TYPE_${value.toUpperCase()} background filterValue`
            }

            container.append(label)
            container.append(valueContainer)

            mainContainer.append(container)
            mainContainer.className = "filterListContainer"

            if(operator == true){
                container.classList.add("operator")
                container.addEventListener("click", () => {
                    selectFilter(value, labelValue)
                })
            }
            else{
                container.addEventListener("click", () => {
                    createFilter(value, labelValue)
                })
            }
        })
        tableFilterListArray[i].append(mainContainer)
    }
}





function filterFilters(input){
    const sanitizedInput = input.replaceAll(regexSpChar, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const inputLength = input.replaceAll(regexSpChar, "").length
    const activeFilter = document.getElementsByClassName("activeFilter")
    if(activeFilter.length > 0){
        const filters = activeFilter[0].getElementsByClassName("tableFilter")
        for(let i = 0; i < filters.length; i++){
            const filterValue = filters[i].getElementsByClassName("filterValue")[0].innerText.replaceAll(regexSpChar, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            if(filters[i].classList.contains("operator") && /\d+/.test(input)){
                filters[i].classList.remove("hide")
            }
            else if(inputLength >= 3 && filterValue.includes(sanitizedInput) && !filters[i].classList.contains("operator")){
                filters[i].classList.remove("hide")
            }
            else if(sanitizedInput === filterValue && inputLength > 0){
                filters[i].classList.remove("hide")
            }
            else{
                filters[i].classList.add("hide")
            }
        }
    }
}






function createFilterArray(objInputArray, obj, sanitize = true){
    let list = []
    for (const name of Object.keys(obj)){
        for (let i = 0; i < objInputArray.length; i++){
            let value = obj[name][objInputArray[i]]
            if(Array.isArray(value)){
                for(let j = 0; j < value.length; j++){
                    if(sanitize){
                        value[j] = sanitizeString(value[j])
                    }
                    if(!list.includes(value[j])){
                        list.push(value[j])
                    }
                }
            }
            else{
                if(sanitize){
                    value = sanitizeString(value)
                }
                if(!list.includes(value)){
                    list.push(value)
                }
            }
        }
    }
    return list
}



function createFilter(value, label, operator = "AND"){
    const activeFilter = document.getElementsByClassName("activeFilter")[0]
    const tableFilterContainer = activeFilter.getElementsByClassName("filterContainer")[0]
    let labelFilterContainer = tableFilterContainer.getElementsByClassName(`${activeFilter.id}${label}Container`.replaceAll(" ", ""))[0]
    if (!labelFilterContainer){
        labelFilterContainer = document.createElement("div"); labelFilterContainer.classList.add(`${activeFilter.id}${label}Container`.replaceAll(" ", ""))
        tableFilterContainer.append(labelFilterContainer)
    }

    labelFilterContainer.append(createFilterElement(label, value, operator, activeFilter))
    selectFilter(value, label, operator)

    filterList()
    lazyLoading(true)
}



function createFilterElement(label, value, operator = "AND", activeFilter){
    const newFilter = document.createElement("span"); newFilter.classList.add("newFilterContainer")
    const filterText = document.createElement("span"); filterText.innerText = `${label}: ${value}`; filterText.classList = "filter crossOnHover newFilter"
    const filterOperator = document.createElement("select"); filterOperator.classList.add("logicalConnector")
    filterOperator.innerHTML = `
        <option value="AND">AND</option>
        <option value="OR">OR</option>
        <option value="NOT">NOT</option>`
    filterOperator.value = operator
    let previousOperator = operator

    newFilter.append(filterOperator)
    newFilter.append(filterText)

    filterText.addEventListener("click", () => {
        newFilter.remove()

        if (filterOperator.value == "OR"){
            updateORinTracker(value.replaceAll(" ", ""), label.replaceAll(" ", ""))
        }
        else{
            for(let i = 0, j = tracker.length; i < j; i++){
                for(let k = 0; k < tracker[i]["filter"].length; k++){
                    if(tracker[i]["filter"][k] == `filter${label}${value}`.replaceAll(" ", "")){
                        tracker[i]["filter"].splice(k, 1)
                    }
                }
            }
        }

        const labelFilterContainer = document.getElementsByClassName(`${activeFilter.id}${label}Container`.replaceAll(" ", ""))
        if (labelFilterContainer){
            if (labelFilterContainer[0].children.length == 0){
                labelFilterContainer[0].remove()
            }
        }

        if (tracker == speciesTracker){
            updateSpeciesMoveFilter()
        }
        else if (tracker == locationsTracker){
            updateLocationsMoveFilter()
        }
        if(trainersFilter === activeFilter){
            trainerSpeciesMatchFilter(false)
        }

        lazyLoading(true)
    })

    filterOperator.addEventListener("focus", () => {
        previousOperator = filterOperator.value
    })

    filterOperator.addEventListener("change", () => {
        if (previousOperator == "OR"){
            updateORinTracker(value.replaceAll(" ", ""), label.replaceAll(" ", ""))
        }
        else{
            for(let i = 0, j = tracker.length; i < j; i++){
                for(let k = 0; k < tracker[i]["filter"].length; k++){
                    if(tracker[i]["filter"][k] == `filter${label}${value}`.replaceAll(" ", "")){
                        tracker[i]["filter"].splice(k, 1)
                    }
                }
            }
        }

        selectFilter(value, label, filterOperator.value)

        if (filterOperator.value == "NOT" && label == "Move"){
            if (tracker == speciesTracker){
                updateSpeciesMoveFilter()
            }
            else if (tracker == locationsTracker){
                updateLocationsMoveFilter()
            }
        }
        if(trainersFilter == activeFilter){
            trainerSpeciesMatchFilter(false)
        }

        lazyLoading(true)
        previousOperator = filterOperator.value
    })

    return newFilter
}



function createOperatorFilter(label, operator, number){
    const activeFilter = document.getElementsByClassName("activeFilter")[0]
    const tableFilterContainer = activeFilter.getElementsByClassName("filterContainer")[0]
    const newFilter = document.createElement("div")
    newFilter.innerText = `${label} ${operator} ${number}`
    newFilter.classList = "filter crossOnHover newFilter"
    tableFilterContainer.append(newFilter)

    newFilter.addEventListener("click", () => {
        for(let i = 0, j = tracker.length; i < j; i++){
            tracker[i]["filter"] = tracker[i]["filter"].filter(value => value !== `filter${label}${operator}${number}`.replaceAll(" ", ""))
        }
        newFilter.remove()
        lazyLoading(true)
    })

    filterList()
    lazyLoading(true)
}



function deleteFiltersFromTable(){
    const activeFilter = document.getElementsByClassName("activeFilter")[0]
    const tableFilterContainer = activeFilter.getElementsByClassName("filterContainer")[0]

    for(let i = 0, j = tracker.length; i < j; i++){
        for(let k = tracker[i]["filter"].length - 1; k >= 0; k--){
            if(/filter|^OR_/.test(tracker[i]["filter"][k])){
                tracker[i]["filter"].splice(k, 1)
            }
        }
    }

    while(tableFilterContainer.firstChild)
        tableFilterContainer.removeChild(tableFilterContainer.firstChild)

    if (tracker == speciesTracker){
        updateSpeciesMoveFilter()
    }
    else if (tracker == locationsTracker){
        updateLocationsMoveFilter()
    }
}



function trainerSpeciesMatchFilter(resetInput = true){
    const trainersFilter = trainersFilterContainer.getElementsByClassName("filter")
    trainersTrackerLoop: for(let i = 0, j = trainersTracker.length; i < j; i++){
        delete trainersTracker[i]["show"]
        if(resetInput){
            trainersTracker[i]["filter"] = []
        }
        else{
            trainersTracker[i]["filter"] = trainersTracker[i]["filter"].filter(filter => filter === "input")
        }
        const zone = trainersTracker[i]["key"].split("\\")[0]
        const trainer = trainersTracker[i]["key"].split("\\")[1]
        const difficulty = checkTrainerDifficulty(zone, trainer)
        delete trainers[zone][trainer]["match"]
        delete trainersTracker[i]["show"]


        filterContainer: for(let k = 0; k < trainersFilter.length; k++){
            let ignoreTrainerTeamIndex = []
            const label = trainersFilter[k].innerText.split(":")[0]
            const value = trainersFilter[k].innerText.replace(" ", "").split(":")[1]
            const operator = trainersFilter[k].parentNode.children[0].value
            let trainerTeam = trainers[zone][trainer]["party"][difficulty]
            let passed = false
            

            trainerTeamLoop: for(let l = 0; l < trainerTeam.length; l++){
                if(ignoreTrainerTeamIndex.includes(l)){
                    continue trainerTeamLoop
                }
                passed = false
                const speciesObj = trainerTeam[l]
                if(label === "Ability"){
                    let abilityName = null
                    Object.keys(abilities).forEach(ability => {
                        if(abilities[ability]["ingameName"] === value){
                            abilityName = ability
                        }
                    })
                    if(abilityName){
                        if(species[speciesObj["name"]]["abilities"][speciesObj["ability"]] === abilityName){
                            continue trainerTeamLoop
                        }
                        else if(typeof innatesDefined !== "undefined"){
                            if(species[speciesObj["name"]]["innates"].includes(abilityName)){
                                continue trainerTeamLoop
                            }
                        }
                    }
                }
                else if(label === "Move"){
                    let moveName = null
                    Object.keys(moves).forEach(move => {
                        if(moves[move]["ingameName"] === value){
                            moveName = move
                        }
                    })
                    if(moveName){
                        if(speciesObj["moves"].includes(moveName)){
                            continue trainerTeamLoop
                        }
                    }
                }
                else if(label === "Item"){
                    if(sanitizeString(speciesObj["item"]) === value){
                        continue trainerTeamLoop
                    }
                }
                ignoreTrainerTeamIndex.push(l)
            }
            passed = trainerTeam.length != ignoreTrainerTeamIndex.length
            trainersTracker[i]["filter"] = filterLogicalConnector(trainersTracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed)
            if (!passed && operator == "AND"){
                continue trainersTrackerLoop
            }
        }
        if(passAllFilters(trainersTracker[i]["filter"])){
            trainers[zone][trainer]["match"] = true
        }
        if(trainersInput.value.trim().length === 0 && trainersFilter.length === 0){
            delete trainers[zone][trainer]["match"]
        }
    }

    showRematch()
}





























































function filterOperators(value, label, obj){
    let operator = document.getElementsByClassName("activeInput")[0].value.match(/>=|<=|=>|=<|=|>|</)
    if(!operator){
        operator = ">="
    }
    else{
        operator = operator[0]   
    }
    const number = document.getElementsByClassName("activeInput")[0].value.match(/\d+/)[0]

    for(let i = 0, j = tracker.length; i < j; i++){
        
        let name = tracker[i]["key"]
        if(tracker === locationsTracker){
            name = tracker[i]["key"].split("\\")[2]
        }

        if(operator === ">=" || operator === "=>"){
            if(!(obj[name][value] >= number)){
                tracker[i]["filter"].push(`filter${label}${operator}${number}`.replaceAll(" ", ""))
            }
        }
        else if(operator === "<=" || operator === "=<"){
            if(!(obj[name][value] <= number)){
                tracker[i]["filter"].push(`filter${label}${operator}${number}`.replaceAll(" ", ""))
            }
        }
        else if(operator === "="){
            if(!(obj[name][value] == number)){
                tracker[i]["filter"].push(`filter${label}${operator}${number}`.replaceAll(" ", ""))
            }
        }
        else if(operator === ">"){
            if(!(obj[name][value] > number)){
                tracker[i]["filter"].push(`filter${label}${operator}${number}`.replaceAll(" ", ""))
            }
        }
        else if(operator === "<"){
            if(!(obj[name][value] < number)){
                tracker[i]["filter"].push(`filter${label}${operator}${number}`.replaceAll(" ", ""))
            }
        }
    }

    createOperatorFilter(label, operator, number)
}

// === 한글 검색 및 다국어 지원 패치 ===
// 검색을 한글/영문 양방향으로: 칩의 표시 텍스트(한글일 수 있음)와 그 반대 언어를 모두 매칭
window.filterFilters = function(input){
    const norm = s => s.replaceAll(regexSpChar, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const sanitizedInput = norm(input);
    const inputLength = input.replaceAll(regexSpChar, "").length;
    // 한글/CJK는 한 글자 정보량이 커서 부분일치 최소 길이를 낮춤(영어 3자 → CJK 1자)
    const hasCJK = /[\u3130-\u318f\uac00-\ud7a3\u3040-\u30ff\u4e00-\u9fff]/.test(input);
    const minMatchLength = hasCJK ? 1 : 3;
    const activeFilter = document.getElementsByClassName("activeFilter");
    if(activeFilter.length > 0){
        const filters = activeFilter[0].getElementsByClassName("tableFilter");
        for(let i = 0; i < filters.length; i++){
            const el = filters[i].getElementsByClassName("filterValue")[0];
            const raw = el ? el.innerText : "";
            const alt = window.KO_SEARCH_ALT ? window.KO_SEARCH_ALT(raw) : null;
            const fv = norm(raw);
            const fvAlt = alt ? norm(alt) : "";
            const isOp = filters[i].classList.contains("operator");
            const inc = fv.includes(sanitizedInput) || (fvAlt && fvAlt.includes(sanitizedInput));
            const eq = sanitizedInput === fv || (fvAlt && sanitizedInput === fvAlt);
            if(isOp && /\d+/.test(input)){ filters[i].classList.remove("hide"); }
            else if(inputLength >= minMatchLength && inc && !isOp){ filters[i].classList.remove("hide"); }
            else if(eq && inputLength > 0){ filters[i].classList.remove("hide"); }
            else { filters[i].classList.add("hide"); }
        }
    }
};

// ── 종족 '이름' 검색 필터 추가 (원본엔 없음) ──
function filterSpeciesName(value, label, operator){
    for(let i = 0, j = tracker.length; i < j; i++){
        const name = tracker[i]["key"];
        const passed = !!(species[name] && sanitizeString(species[name]["name"]) === value);
        tracker[i]["filter"] = filterLogicalConnector(tracker[i]["filter"], value.replaceAll(" ", ""), label.replaceAll(" ", ""), operator, passed);
    }
}
const _selectFilter_ko = selectFilter;
window.selectFilter = function(value, label, operator = "AND"){
    if(label === "Name"){ return filterSpeciesName(value, label, operator); }
    return _selectFilter_ko(value, label, operator);
};
const _setFilters_ko = setFilters;
window.setFilters = async function(){
    await _setFilters_ko();
    try { createFilterGroup(createFilterArray(["name"], species), "Name", [speciesFilterList]); }
    catch(e){ console.warn("[ko] name filter:", e); }
};

// ── 모든 탭에서 표 즉시 나열: 한글 입력 시 각 행의 한글 번역에 매칭 ──
// 원본 필터 함수들은 영문 원본 데이터에만 매칭 → 한글 검색은 0건(빈 표)이었음.
// 방식: 원본(영문) 필터를 먼저 실행한 뒤, 한글 입력이면 각 행의 한글 블롭에
//       매칭되는 행의 "input" 필터를 해제하여 추가 노출(이름/설명/플래그 등).
const _koRe = /[\u3130-\u318f\uac00-\ud7a3\u3040-\u30ff\u4e00-\u9fff]/;
const _koHasCJK = s => _koRe.test("" + s);
const _koNeedle = input => ("" + input).trim().toLowerCase().normalize("NFC").replaceAll(regexSpChar, "");
const _koCache = {};
const _koCacheFor = tag => _koCache[tag] || (_koCache[tag] = new Map());

// 출현 방식(Method) 한글 매핑 사전 (라벨 칩 없이 직접 검색 지원)
const _koMethodMap = {
    "land": ["풀숲", "육지", "지상", "풀밭", "야생"],
    "day": ["낮", "주간"],
    "night": ["밤", "야간"],
    "morning": ["아침"],
    "evening": ["저녁"],
    "dusk": ["해질녘", "황혼"],
    "dawn": ["새벽"],
    "surfing": ["파도타기", "수면", "물"],
    "water": ["물", "수면", "파도타기"],
    "rock smash": ["바위깨기", "바위 부수기", "바위"],
    "old rod": ["낡은 낚싯대", "낚시", "낚싯대"],
    "good rod": ["좋은 낚싯대", "낚시", "낚싯대"],
    "super rod": ["대단한 낚싯대", "낚시", "낚싯대"],
    "fishing": ["낚시", "낚싯대"],
    "headbutt": ["박치기", "나무"],
    "raid": ["레이드", "맥스 레이드"]
};

// 붙여쓴 특성명 보정 사전 (CFRU 상수명 띄어쓰기 누락 보정 -> 254건 전수 100% 매칭)
const _koCompoundAbilities = {
    "ABILITY_RUNAWAY": "도주",
    "ABILITY_KEENEYE": "날카로운눈",
    "ABILITY_DRYSKIN": "건조피부",
    "ABILITY_ICEBODY": "아이스바디",
    "ABILITY_NOGUARD": "노가드",
    "ABILITY_FURCOAT": "퍼코트",
    "ABILITY_ASONE_GRIM": "혼연일체",
    "ABILITY_ASONE_CHILLING": "혼연일체",
    "ABILITY_ZENMODE": "달마모드",
    "ABILITY_ICEFACE": "아이스페이스"
};

// 특성 보유 포켓몬 색인 캐시
let _koAbilityPokemonMap = null;
function _koGetAbilityPokemon(abilityKey){
    if(!_koAbilityPokemonMap && typeof window.species !== "undefined"){
        _koAbilityPokemonMap = {};
        for(const sp in window.species){
            const sRec = window.species[sp];
            const abils = (sRec.abilities || []).concat(sRec.innates || []);
            for(let a = 0; a < abils.length; a++){
                const abKey = abils[a];
                if(!_koAbilityPokemonMap[abKey]) _koAbilityPokemonMap[abKey] = [];
                _koAbilityPokemonMap[abKey].push(sp);
            }
        }
    }
    return (_koAbilityPokemonMap && _koAbilityPokemonMap[abilityKey]) || [];
}

// 한 항목(명칭/식별자/특수키)의 모든 한글 표기를 parts 에 수집
function _koPush(parts, s){
    if(s == null || s === "") return;
    const str = "" + s, seen = [];
    const add = x => { if(x && seen.indexOf(x) === -1){ seen.push(x); parts.push(x); } };
    if(typeof KO_TRANSLATE === "function"){
        add(KO_TRANSLATE(str));                         // 원문 그대로(설명문/지명 등)
        try { add(KO_TRANSLATE(sanitizeString(str))); } catch(e){}  // sanitize 표시명
    }
    if(typeof abilities !== "undefined" && abilities[str] && abilities[str]["ingameName"]){
        if(typeof KO_TRANSLATE === "function") add(KO_TRANSLATE(abilities[str]["ingameName"]));        // 커스텀 특성명 대응
    }
    if(typeof moves !== "undefined" && moves[str] && moves[str]["ingameName"]){
        if(typeof KO_TRANSLATE === "function") add(KO_TRANSLATE(moves[str]["ingameName"]));           // 기술 표시명(학습기 검색용)
    }
}
// 원본 실행 후: blobFn(key)->한글문자열 에 needle 이 포함된 숨은 행을 노출
function _koReveal(input, tag, blobFn, onMatch){
    if(!_koHasCJK(input)) return;
    const needle = _koNeedle(input);
    if(!needle) return;
    const cache = _koCacheFor(tag);
    for(let i = 0, j = Object.keys(tracker).length; i < j; i++){
        if(tracker[i]["filter"].indexOf("input") === -1) continue;  // 이미 보이는 행은 건너뜀
        const key = tracker[i]["key"];
        let blob = cache.get(key);
        if(blob === undefined){
            blob = ("" + blobFn(key)).toLowerCase().normalize("NFC").replaceAll(regexSpChar, "");
            cache.set(key, blob);
        }
        if(blob.indexOf(needle) !== -1){
            tracker[i]["filter"] = tracker[i]["filter"].filter(v => v !== "input");
            if(onMatch) onMatch(key);
        }
    }
    lazyLoading(true);
}

// ★ 중요: filterTableInput 등은 tableUtility.js(별도 파일)에 정의됨.
//   따라서 typeof 가드 + 지연 폴링으로 원본이 준비된 뒤 래핑한다.
function _koWrap(name, wrapFn){
    const fn = window[name];
    if(typeof fn !== "function" || fn.__ko) return true;  // 없음/이미래핑
    const wrapped = wrapFn(fn);
    wrapped.__ko = true;
    window[name] = wrapped;
    return true;
}
function _koInstall(){
    // 종족/기술/특성
    _koWrap("filterTableInput", orig => function(input, obj, keyArray){
        orig(input, obj, keyArray);
        const isSpecies = (obj === window.species);
        const isMoves = (obj === window.moves);
        const isAbilities = (obj === window.abilities);
        const tag = isSpecies ? "species" : (isMoves ? "moves" : "abilities");
        _koReveal(input, tag, key => {
            const rec = obj[key];
            if(!rec) return "";
            const parts = [];
            if(isSpecies){
                // 포켓몬 탭: 검색 가능한 모든 필드 — 이름/타입/특성/알그룹/도구/기술(학습기 전체)
                _koPush(parts, rec["name"]);
                _koPush(parts, sanitizeString("" + (rec["type1"] || "")));
                _koPush(parts, sanitizeString("" + (rec["type2"] || "")));
                const arrs = ["abilities", "innates"];
                for(let x = 0; x < arrs.length; x++){ const v = rec[arrs[x]]; if(Array.isArray(v)) for(let a = 0; a < v.length; a++) _koPush(parts, v[a]); }
                const flds = ["eggGroup1", "eggGroup2", "item1", "item2"];
                for(let x = 0; x < flds.length; x++) _koPush(parts, rec[flds[x]]);
                const lrn = ["levelUpLearnsets", "TMHMLearnsets", "eggMovesLearnsets", "tutorLearnsets"];
                for(let x = 0; x < lrn.length; x++){
                    const v = rec[lrn[x]];
                    if(Array.isArray(v)) for(let a = 0; a < v.length; a++){ const mv = Array.isArray(v[a]) ? v[a][0] : v[a]; _koPush(parts, mv); }
                }
            } else if(isMoves){
                // ★ 기술(Moves) 탭: 기술명, 표시명, 타입(전기/노말 등), 분류(물리/특수/변화), 효과, 설명문
                _koPush(parts, rec["name"]);
                _koPush(parts, rec["ingameName"]);
                _koPush(parts, sanitizeString("" + (rec["type"] || "")));
                _koPush(parts, sanitizeString("" + (rec["split"] || "")));
                _koPush(parts, rec["effect"]);
                const desc = rec["description"];
                if(Array.isArray(desc)) { for(let d = 0; d < desc.length; d++) _koPush(parts, desc[d]); }
                else _koPush(parts, desc);
            } else if(isAbilities || obj === window.abilities){
                // ★ 특성(Abilities) 탭: 특성명, 표시명, 합성어 보정명, 설명문, 보유 포켓몬명
                _koPush(parts, rec["name"]);
                _koPush(parts, rec["ingameName"]);
                if(_koCompoundAbilities[key]) parts.push(_koCompoundAbilities[key]);
                if(_koCompoundAbilities[rec["name"]]) parts.push(_koCompoundAbilities[rec["name"]]);
                _koPush(parts, rec["description"]);
                const holders = _koGetAbilityPokemon(key);
                for(let h = 0; h < holders.length; h++){
                    _koPush(parts, holders[h]);
                    _koPush(parts, sanitizeString(holders[h]));
                }
            } else {
                for(let f = 0; f < keyArray.length; f++){
                    const v = rec[keyArray[f]];
                    if(Array.isArray(v)){ for(let a = 0; a < v.length; a++) _koPush(parts, v[a]); }
                    else _koPush(parts, v);
                }
            }
            return parts.join(" ");
        });
    });
    // 출현장소: key = "zone\\method\\SPECIES_x"
    _koWrap("filterLocationsTableInput", orig => function(input, obj, keyArray){
        orig(input, obj, keyArray);
        _koReveal(input, "locations", key => {
            const seg = key.split("\\");
            const parts = [];
            // (1) 지명: 원문 + 시간대 제거 지명 + 층수/서브구역 제거 베이스 지명 (신더화산, 고드름동굴 등)
            const rawZone = seg[0];
            _koPush(parts, rawZone);
            const cleanZone = rawZone.replace(/\s+(Anytime|Morning|Day|Night|Evening|Dusk|Dawn)$/i, "").trim();
            if(cleanZone !== rawZone) _koPush(parts, cleanZone);

            const baseZone = cleanZone.replace(/\s+(B?\d+F?|\d+F?|F\d+|Back|Alt|Ext|Left|Right|North|South|East|West|Room|Storage|Shadow|Clearing|Entrance).*$/i, "").trim();
            if(baseZone && baseZone !== cleanZone) _koPush(parts, baseZone);

            // (2) 출현방식: 원문 번역 + _koMethodMap 매핑 (풀숲, 파도타기, 낚시, 바위깨기 등)
            const rawMethod = seg[1];
            _koPush(parts, rawMethod);
            const mLower = ("" + rawMethod).toLowerCase();
            for(const mk in _koMethodMap){
                if(mLower.indexOf(mk) !== -1){
                    const koWords = _koMethodMap[mk];
                    for(let w = 0; w < koWords.length; w++) parts.push(koWords[w]);
                }
            }

            // (3) 포켓몬: 이름, 타입, 진화 라인 전체 포켓몬명
            const name = seg[2];
            if(name){
                _koPush(parts, name);
                _koPush(parts, sanitizeString(name));
                const specRec = (typeof window.species !== "undefined") ? window.species[name] : (obj ? obj[name] : null);
                if(specRec){
                    _koPush(parts, sanitizeString("" + (specRec["type1"] || "")));
                    _koPush(parts, sanitizeString("" + (specRec["type2"] || "")));
                    const evo = specRec["evolutionLine"];
                    if(Array.isArray(evo)){
                        for(let e = 0; e < evo.length; e++){
                            _koPush(parts, evo[e]);
                            _koPush(parts, sanitizeString(evo[e]));
                        }
                    }
                }
            }
            return parts.join(" ");
        });
    });
    // 도구
    _koWrap("filterItemsTableInput", orig => function(input, keyArray){
        orig(input, keyArray);
        _koReveal(input, "items", key => {
            const rec = (typeof items !== "undefined") ? items[key] : null;
            if(!rec) return "";
            const parts = [];
            for(let f = 0; f < keyArray.length; f++) _koPush(parts, rec[keyArray[f]]);
            if(rec["locations"]){ const ms = Object.keys(rec["locations"]); for(let m = 0; m < ms.length; m++) _koPush(parts, rec["locations"][ms[m]]); }
            return parts.join(" ");
        });
    });
    // 트레이너: key = "zone\\trainer"
    _koWrap("filterTrainersTableInput", orig => function(input){
        orig(input);
        _koReveal(input, "trainers", key => {
            const seg = key.split("\\");
            const zone = seg[0], trainer = seg[1];
            const parts = [];
            _koPush(parts, zone);
            if(typeof trainers !== "undefined" && trainers[zone] && trainers[zone][trainer]){
                _koPush(parts, trainers[zone][trainer]["ingameName"]);
                try {
                    const diff = checkTrainerDifficulty(zone, trainer);
                    const party = trainers[zone][trainer]["party"][diff] || [];
                    for(let k = 0; k < party.length; k++) _koPush(parts, party[k]["name"]);
                } catch(e){}
            }
            return parts.join(" ");
        }, key => {
            const seg = key.split("\\");
            if(typeof trainers !== "undefined" && trainers[seg[0]] && trainers[seg[0]][seg[1]]){
                trainers[seg[0]][seg[1]]["match"] = true;
            }
        });
        if(typeof showRematch === "function"){ try { showRematch(); } catch(e){} }
    });
    // 넷 다 준비되면 완료
    return typeof window.filterTableInput === "function" && window.filterTableInput.__ko
        && typeof window.filterLocationsTableInput === "function" && window.filterLocationsTableInput.__ko
        && typeof window.filterItemsTableInput === "function" && window.filterItemsTableInput.__ko
        && typeof window.filterTrainersTableInput === "function" && window.filterTrainersTableInput.__ko;
}
let _koTries = 0;
const _koTimer = setInterval(function(){
    _koTries++;
    let done = false;
    try { done = _koInstall(); } catch(e){ console.warn("[ko] install:", e); }
    if(done || _koTries > 150) clearInterval(_koTimer);  // 최대 ~30s 폴링
}, 200);
try { _koInstall(); } catch(e){}  // 즉시 1회 시도
