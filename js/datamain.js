var officeElement, votesElement, stateDropDownElement, sortByNameElement;

var sortedMembersBySeniority = [];
var sortedMembersByName = [];
var sortedMembersByVotes = [];

$(function () {
	// the moving nav bar
	var $nav = $("nav"),
	$clone = $nav.before($nav.clone().addClass("clone"));
	$(window).on("scroll", function () {
		var fromTop = $("body").scrollTop();
		$('body').toggleClass("down", (fromTop > 500));
	});

	officeElement = $("#office")[0];
	votesElement = $("#votes")[0];
	stateDropDownElement = $("#stateDropDown")[0];
	sortByNameElement = $("#sortByName")[0];

	var importedDataPageSort;

	//longer. not prefered
	//var pageID = document.getElementsByTagName("body")[0].getAttribute("id");
	// attr() returns the attribute value of the FIRST selected element
	var pageID = $("body").attr("id");

	if (pageID == "dataPageHouse") {
		importedDataPageSort = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
	} else {
		importedDataPageSort = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate"
	}

	// on dataready only gets called after the server replies 
	//importedDataPageSort lets us use this call for two pages in the same js file
	$.getJSON(importedDataPageSort, onDataReady);
});

// ondataready takes the resulting js from the json call as a parameter
// we assign it to data and move on with printing table 
// the functions may remain in the bottom of the page, not included in the callback funcktion
function onDataReady() {
	
	createStateNames();

	for (var i = 0; i < data.results[0].members.length; i++) {
		sortedMembersBySeniority.push(data.results[0].members[i]);
		sortedMembersByName.push(data.results[0].members[i]);
		sortedMembersByVotes.push(data.results[0].members[i]);
	}
	sortedMembersBySeniority.sort(function (a, b) {
		return (b.seniority - a.seniority);
	});
	sortedMembersByVotes.sort(function (a, b) {
		return (b.votes_with_party_pct - a.votes_with_party_pct);
	});

	// Sorting array prototype
	sortedMembersByName.sort(function (a, b) {
		if (a.first_name < b.first_name) {
			return -1;
		} else if (a.first_name > b.first_name) {
			return 1;
		} else {
			return 0;
		}
	});

	prepareTable();

	$("#stateDropDown")[0].change = prepareTable;
	stateDropDownElement.onchange = prepareTable;
	officeElement.onchange = officeCheck;
	sortByNameElement.onchange = sortByNameCheck;
	votesElement.onchange = votesCheck;

	$("#r")[0].onchange = prepareTable;
	$("#d")[0].onchange = prepareTable;
	$("#i")[0].onchange = prepareTable;
}

function votesCheck() {
	if (votesElement.checked) {
		sortByNameElement.checked = false;
		officeElement.checked = false;
	}
	prepareTable();
}

function officeCheck() {
	if (officeElement.checked) {
		sortByNameElement.checked = false;
		votesElement.checked = false;
	}
	prepareTable();
}

function sortByNameCheck() {
	if (sortByNameElement.checked) {
		officeElement.checked = false;
		votesElement.checked = false;
	}
	prepareTable();
}

function prepareTable() {
	$("#senate-data").html("");
	var output = "";
	var members = [];
	if (officeElement.checked) {
		members = sortedMembersBySeniority;
	} else if (sortByNameElement.checked) {
		members = sortedMembersByName;
	} else if (votesElement.checked) {
		members = sortedMembersByVotes;
	} else {
		members = data.results[0].members;
	}

	var template = $("#dataTemplate").html();
	
	for (var i = 0; i < members.length; i++) {
		var member = members[i];
		if (isVisible(member)) {
			output += Mustache.render(template, member);
		}
	}
	$("#senate-data").html(output);
}

function isVisible(input) {
	return hasParty(input) && hasState(input);
}

function hasParty(inputMember) {
	var valueArray = [];
	var rep = $("#r")[0].checked;
	var dem = $("#d")[0].checked;
	var ind = $("#i")[0].checked;
	if (rep) {
		valueArray.push("R");
	}
	if (dem) {
		valueArray.push("D");
	}
	if (ind) {
		valueArray.push("I")
	}
	if (!rep && !dem && !ind) {
		valueArray.push("R");
		valueArray.push("D");
		valueArray.push("I");
	}
	// When indexOf( which finds the pisition of the element) is not equal to -1(which means it has not found any Rs Ds or Is in the array) it returns true
	
	//returns true for the members with the member party that has been added to the valuearrays
	return valueArray.includes(inputMember.party);
}

function hasState(inputValue) {
	//making sure that the variables are local and not global
	var e = stateDropDownElement;
	// Getting the text of the selected element
	/*var strUser = e.options[e.selectedIndex].text;*/
	// Vs getting the value of the selected option. The select option if not specified it takes text as a value
	var strUser = e.value;
	return inputValue.state == strUser || strUser == "All";
}

function createStateNames() {
	var stateoutput = "";
	var members = data.results[0].members;
	for (var i = 0; i < members.length; i++) {
		//Check stateoutpu if already contains the next state
		stateoutput += "<option>" + members[i].state;
		stateoutput += "</option> ";
	}
	//split and sort do not need separate functions
	var statePreFinalArray = stateoutput.split(" ").sort();
	var stateFinalArray = checkStateNamesForDuplicates(statePreFinalArray);
	//making sure that the default option is "all" and it is in the begining of the list with unshift
	stateFinalArray.unshift("<option>All</option>");
	stateDropDownElement.innerHTML = stateFinalArray.join("");
}

function checkStateNamesForDuplicates(inputArray) {
	var checkedArray = [];
	for (var i = 0; i < inputArray.length; i++) {
		if (checkedArray.indexOf(inputArray[i]) == -1) {
			checkedArray.push(inputArray[i]);
		}
	}
	return checkedArray;
}


