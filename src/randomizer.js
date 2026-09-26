function encodeYID(num) {
	const charactersYID = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const base = charactersYID.length;
	let result = "";
	do {
		result = charactersYID[num % base] + result;
		num = Math.floor(num / base);
	} while (num > 0);
	while (result.length < 6) {
		result = "0" + result;
	}
	return result;
}

function decodeYID(str) {
	const charactersYID = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const base = charactersYID.length;
	let result = 0;
	for (let char of str) {
		const index = charactersYID.indexOf(char);
		if (index < 0) {
			return -1;
		}
		result = result * base + index;
	}
	return result;
}

function isUInt32(num) {
	return Number.isInteger(num) && num >= 0 && num <= 0xFFFFFFFF;
}

function findSector(view, id) {
	let latestOffset = -1;
	let latestSaveIndex = -1;
	for (let x = 0x0; x < 0x1C000; x += 0x1000) {
		const sectorId = view.getUint16(x + 0xFF4, true);
		const saveIndex = view.getUint32(x + 0xFFC, true);
		if (sectorId === id && saveIndex > latestSaveIndex) {
			latestOffset = x;
			latestSaveIndex = saveIndex;
		}
	}
	return latestOffset;
}

function readDataFromSaveFile(view) {
	for (let sectorId = 0; sectorId < 14; sectorId++) {
		if (findSector(view, sectorId) == -1) {
			return undefined;
		}
	}
	const trainerInfo = findSector(view, 0x0);
	return view.getUint32(trainerInfo + 0x00A, true);
}

function submitEnhancements() {
	const yid = document.getElementById("yidInput").value;
	const randomizedAbilitiesChecked = document.getElementById("saveRandomizedAbilitiesCheckbox").checked;
	const randomizedLearnsetChecked = document.getElementById("saveRandomizedLearnsetCheckbox").checked;
	const rebalancedStatsChecked = document.getElementById("saveRebalancedStatsCheckbox").checked;
	const randomizedSpeciesChecked = document.getElementById("saveRandomizedSpeciesCheckbox").checked;
	const gen8UnlockedChecked = document.getElementById("saveGen8UnlockedCheckbox")?.checked ?? false;
	let data = {};
	let yidChanged = false;
	if (yid.length === 0) {
		if (randomizedAbilitiesChecked || randomizedLearnsetChecked || randomizedSpeciesChecked) {
			alert("랜덤마이저 옵션을 적용하려면 올바른 YID가 필요합니다.");
			return;
		} else {
			data = undefined;
		}
	} else {
		const trainerIdFull = decodeYID(yid);
		if (trainerIdFull <= 0 || !isUInt32(trainerIdFull)) {
			alert("유효하지 않은 YID입니다.");
			return;
		}
		const trainerId = trainerIdFull & 0xFFFF;
		const trainerSecretId = trainerIdFull >>> 16;
		data = {
			trainerIdFull,
			trainerId,
			trainerSecretId
		};
		if (typeof saveData !== 'undefined') {
			yidChanged = saveData.trainerIdFull != trainerIdFull;
		}
	}
	processSaveData(data);
	const saveRandomizedAbilities = settings.includes("saveRandomizedAbilities");
	const saveRandomizedLearnset = settings.includes("saveRandomizedLearnset");
	const saveRebalancedStats = settings.includes("saveRebalancedStats");
	const saveRandomizedSpecies = settings.includes("saveRandomizedSpecies");
	const saveGen8Unlocked = settings.includes("saveGen8Unlocked");
	changeSaveSetting("saveRandomizedAbilities", randomizedAbilitiesChecked);
	changeSaveSetting("saveRandomizedLearnset", randomizedLearnsetChecked);
	changeSaveSetting("saveRebalancedStats", rebalancedStatsChecked);
	changeSaveSetting("saveRandomizedSpecies", randomizedSpeciesChecked);
	changeSaveSetting("saveGen8Unlocked", gen8UnlockedChecked);
	if ((yidChanged && (randomizedAbilitiesChecked || randomizedLearnsetChecked || randomizedSpeciesChecked)) || (randomizedAbilitiesChecked != saveRandomizedAbilities) || (randomizedLearnsetChecked != saveRandomizedLearnset) || (rebalancedStatsChecked != saveRebalancedStats) || (randomizedSpeciesChecked != saveRandomizedSpecies) || (gen8UnlockedChecked != saveGen8Unlocked)) {
		clearSpeciesReload();
	} else {
		overlay.click();
	}
}

async function reloadPopupEnhancements() {
	while (popup.firstChild){
		popup.removeChild(popup.firstChild);
	}
	const saveOptions = document.createElement("div");
	saveOptions.id = "saveOptions";
	saveOptions.style.display = "inline-block";
	const saveOptionsWrapper = document.createElement("div");
	saveOptionsWrapper.id = "saveOptionsWrapper";
	saveOptionsWrapper.style.width = "fit-content";
	const saveOptionsFieldset = document.createElement("fieldset");
	saveOptionsFieldset.style.textAlign = "center";
	const saveOptionsLegend = document.createElement("legend");
	saveOptionsLegend.innerText = "확장 기능 (랜덤/세이브 연동)";
	saveOptionsFieldset.append(saveOptionsLegend);
	const yidFieldset = document.createElement("fieldset");
	yidFieldset.style.textAlign = "center";
	const yidLegend = document.createElement("legend");
	yidLegend.innerText = "YID (고유 시드)";
	yidFieldset.append(yidLegend);
	const yidInput = document.createElement("input");
	yidInput.id = "yidInput";
	yidInput.type = "search";
	yidInput.style.cssText = "width: 120px; text-align: center !important";
	yidInput.setAttribute("maxlength",6);
	yidFieldset.append(yidInput);
	yidFieldset.style.display = "flex";
	yidFieldset.style.flexDirection = "column";
	yidFieldset.style.textAlign = "center";
	yidFieldset.style.alignItems = "center";
	const saveFileInputButton = document.createElement("button");
	saveFileInputButton.id = "saveFileInputButton";
	saveFileInputButton.type = "button";
	saveFileInputButton.textContent = "세이브 업로드 (.sav)";
	saveFileInputButton.onclick = openSaveFileDialog;
	saveFileInputButton.style.width = "fit-content";
	yidFieldset.append(saveFileInputButton);
	const saveFileInput = document.createElement("input");
	saveFileInput.id = "saveFileInput";
	saveFileInput.classList.add("hide");
	saveFileInput.type = "file";
	saveFileInput.accept = ".sav";
	saveFileInput.addEventListener("change", function() {
		var [file] = saveFileInput.files;
		if (file) {
			saveFileInput.value = null;
			file.arrayBuffer().then(buffer => {
				const view = new DataView(buffer);
				const trainerIdFull = readDataFromSaveFile(view);
				if (trainerIdFull) {
					yidInput.value = encodeYID(trainerIdFull);
				} else {
					alert("세이브 데이터를 읽을 수 없습니다! 강제 세이브(Save State)가 아닌 일반 배터리 세이브(.sav) 파일인지 확인해 주세요.");
				}
			})
		}
	});
	yidFieldset.append(saveFileInput);
	if (typeof saveData !== 'undefined') {
		yidInput.value = encodeYID(saveData.trainerIdFull);
	}
	saveOptionsFieldset.append(yidFieldset);
	saveOptionsFieldset.append(returnSaveSettingEl("saveRebalancedStats", "종족값 균등화 (BST 600 평준화)"));
	saveOptionsFieldset.append(returnSaveSettingEl("saveRandomizedAbilities", "특성 랜덤화"));
	saveOptionsFieldset.append(returnSaveSettingEl("saveRandomizedLearnset", "자력기 랜덤화"));
	const randomizedSpeciesEl = returnSaveSettingEl("saveRandomizedSpecies", "출현 포켓몬 랜덤화");
	saveOptionsFieldset.append(randomizedSpeciesEl);
	const gen8El = returnSaveSettingEl("saveGen8Unlocked", "8세대 포켓몬 해금 여부");
	gen8El.style.display = settings.includes("saveRandomizedSpecies") ? "" : "none";
	randomizedSpeciesEl.querySelector("input[type='checkbox']").addEventListener("change", function() {
		gen8El.style.display = this.checked ? "" : "none";
		if (!this.checked) {
			gen8El.querySelector("input[type='checkbox']").checked = false;
		}
	});
	saveOptionsFieldset.append(gen8El);
	const dataWrapper = document.createElement("div");
	dataWrapper.id = "dataWrapper";
	dataWrapper.style.display = "flex";
	dataWrapper.style.justifyContent = "center";
	const updateData = document.createElement("button");
	updateData.id = "updateData";
	updateData.type = "button";
	updateData.textContent = "적용 (새로고침)";
	updateData.onclick = submitEnhancements;
	dataWrapper.append(updateData);
	const clearData = document.createElement("button");
	clearData.id = "clearData";
	clearData.type = "button";
	clearData.textContent = "초기화";
	clearData.onclick = clearCurrentSave;
	dataWrapper.append(clearData);
	saveOptionsFieldset.append(dataWrapper);
	saveOptionsWrapper.append(saveOptionsFieldset);
	saveOptions.append(saveOptionsWrapper);
	popup.append(saveOptions);
	overlay.style.display = "flex";
	body.classList.add("fixed");
}

function processSaveData(data) {
	window.saveData = data;
	localStorage.setItem("saveData", JSON.stringify(saveData));
}

function openSaveFileDialog() {
	document.getElementById("saveFileInput").click();
}

function clearCurrentSave() {
	document.getElementById("yidInput").value = "";
	document.getElementById("saveRandomizedAbilitiesCheckbox").checked = false;
	document.getElementById("saveRandomizedLearnsetCheckbox").checked = false;
	document.getElementById("saveRebalancedStatsCheckbox").checked = false;
	document.getElementById("saveRandomizedSpeciesCheckbox").checked = false;
	const gen8Checkbox = document.getElementById("saveGen8UnlockedCheckbox");
	if (gen8Checkbox) gen8Checkbox.checked = false;
}

async function clearSpeciesReload() {
	localStorage.removeItem("species");
	window.location.reload();
}

async function changeSaveSetting(setting, enable) {
	if (enable) {
		if (!settings.includes(setting)) {
			settings.push(setting)
		}
	} else {
		settings = settings.filter(value => value != setting);
	}
	localStorage.setItem("DEXsettings", JSON.stringify(settings));
}

function returnSaveSettingEl(setting, settingText) {
	const settingEl = document.createElement("div");
	const settingCheckbox = document.createElement("input");
	settingCheckbox.setAttribute("type", "checkbox");
	settingCheckbox.setAttribute("id", `${setting}Checkbox`);
	const settingLabel = document.createElement("label");
	settingLabel.setAttribute("for", `${setting}Checkbox`);
	settingLabel.innerText = settingText;
	settingEl.append(settingCheckbox);
	settingEl.append(settingLabel);
	if (settings.includes(setting)) {
		settingCheckbox.checked = true;
	}
	return settingEl;
}

new Promise(resolve => {
	const selector = "#tableButton";
	if (typeof species !== 'undefined' && document.querySelector(selector)) {
		return resolve(document.querySelector(selector));
	}
	const observer = new MutationObserver(mutations => {
		if (typeof species !== 'undefined' && document.querySelector(selector)) {
			observer.disconnect();
			resolve(document.querySelector(selector));
		}
	});
	observer.observe(document, {
		childList: true,
		subtree: true
	});
}).then((tableButton) => {
	const enhancementsWrapper = document.createElement("div");
	enhancementsWrapper.id = "enhancementsWrapper";
	const buttonEnhancements = document.createElement("button");
	buttonEnhancements.id = "buttonEnhancements";
	buttonEnhancements.type = "button";
	buttonEnhancements.textContent = "확장 기능";
	buttonEnhancements.style.width = "140px";
	buttonEnhancements.onclick = reloadPopupEnhancements;
	enhancementsWrapper.append(buttonEnhancements);
	tableButton.append(enhancementsWrapper);
	
	const storedSaveData = localStorage.getItem("saveData");
	if (storedSaveData && storedSaveData != "undefined") {
		processSaveData(JSON.parse(storedSaveData));
	}
});
