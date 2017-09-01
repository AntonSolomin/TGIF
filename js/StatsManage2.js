// Creating variables to be counted for statistics
var lengthR = 0;
var lengthD = 0;
var lengthI = 0;

var totalR = 0;
var totalD = 0;
var totalI = 0;

var arrayR = [];
var arrayD = [];
var arrayI = [];

var members = data.results[0].members;
var glance = statistics.at_a_glance;

counting();
calculatingAverage();

glance.democrats.number_of_democrats = lengthD;
glance.republicans.number_of_republicans = lengthR;
glance.independent.number_of_independent = lengthI;
var lengthT = lengthD + lengthR + lengthI;
glance.total.number_of_total = lengthT;

glance.democrats.number_o_democrats_voted_with_the_party = totalR / lengthR;
glance.republicans.number_o_republicans_voted_with_the_party = totalD / lengthD;
glance.independent.number_o_independent_voted_with_the_party = totalI / lengthI;
var totalN = totalD + totalR + totalI;
glance.independent.number_o_independent_voted_with_the_party = totalN / lengthT;

statistics.least_engaged = getLowestTen(members, "missed_votes");
statistics.most_engaged = getHighestTen(members, "missed_votes");

printingTableLowest("missed_votes_pct");
printingTableHighest("missed_votes_pct");
printingTableGlance();


function counting() {
	for (var i = 0; i < members.length; i++) {
		if (members[i].party == "R") {
			lengthR = lengthR + 1;
		} else if (members[i].party == "D") {
			lengthD = lengthD + 1;
		} else if (members[i].party == "I") {
			lengthI = lengthI + 1;
		}
	}
}

function calculatingAverage() {
	for (var i = 0; i < members.length; i++) {
		if (members[i].party == "R") {
			totalR = totalR + Number(members[i].votes_with_party_pct);
			arrayR.push(Number(members[i]));
		} else if (members[i].party == "D") {
			totalD = totalD + Number(members[i].votes_with_party_pct);
			arrayD.push(members[i]);
		} else if (members[i].party == "I") {
			totalI = totalI + Number(members[i].votes_with_party_pct);
			arrayI.push(members[i]);
		}
	}
}

function getLowestTen(inputArray, sortingKey) {
	inputArray.sort(function (a, b) {
		return a[sortingKey] - b[sortingKey];
	});
	var number = 0;
	var lowest = [];
	for (var i = 0; i < inputArray.length; i++) {
		var current = inputArray[i][sortingKey];
		for (var j = i; j < inputArray.length; j++) {
			var second = inputArray[j][sortingKey];
			if (current == second) {
				if (!lowest.includes(inputArray[j])) {
					number++;
					lowest.push(inputArray[j]);
				}
				if (number >= (inputArray.length / 10)) {
					if (inputArray[i][sortingKey] != inputArray[j + 1][sortingKey]) {
						console.log(lowest);
						return lowest;
					}
				}
			}
		}
	}
	return lowest;
}

function getHighestTen(inputArray, sortingKey) {
	inputArray.sort(function (a, b) {
		return b[sortingKey] - a[sortingKey];
	});
	var number = 0;
	var highest = [];
	for (var i = 0; i < inputArray.length; i++) {
		var current = inputArray[i][sortingKey];
		for (var j = i; j < inputArray.length; j++) {
			var second = inputArray[j][sortingKey];
			if (current == second) {
				if (!highest.includes(inputArray[j])) {
					number++;
					highest.push(inputArray[j]);
				}
				if (number >= (inputArray.length / 10)) {
					if (inputArray[i][sortingKey] != inputArray[j + 1][sortingKey]) {
						return highest;
					}
				}
			}
		}
	}
	return highest;
}

function printingTableLowest(inputPercentageKey) {
	document.getElementById("senatemeng").innerHTML = "";
	var output = "";
	var sorted = statistics.least_engaged;
	for (var i = 0; i < sorted.length; i++) {
		output += "<tr>"; 
		output += "<td>" + "<a href=" + sorted[i].url + ">" + sorted[i].first_name + " " + (sorted[i].middle_name || "") + " " + sorted[i].last_name + "</a>";
		output += "</td>";
		if (inputPercentageKey == "missed_votes_pct") {
			output += "<td>" + sorted[i].missed_votes;
		} else if (inputPercentageKey == "votes_with_party_pct") {
			output += "<td>" + ((sorted[i].total_votes - sorted[i].missed_votes)*sorted[i].votes_with_party_pct/100);
		}
		output += "</td>";
		output += "<td>" + sorted[i][inputPercentageKey];
		output += "</td>";
		output += "</tr>";
		document.getElementById("senatemeng").innerHTML = output;
	}
}

function printingTableHighest(inputPercentageKey) {
	document.getElementById("senateleng").innerHTML = "";
	var output = "";
	var sorted = statistics.most_engaged;
	for (var i = 0; i < sorted.length; i++) {
		output += "<tr>";
		output += "<td>" + "<a href=" + sorted[i].url + ">" + sorted[i].first_name + " " + (sorted[i].middle_name || "") + " " + sorted[i].last_name + "</a>";
		output += "</td>";
		if (inputPercentageKey == "missed_votes_pct") {
			output += "<td>" + sorted[i].missed_votes;
		} else if (inputPercentageKey == "votes_with_party_pct") {
			output += "<td>" + ((sorted[i].total_votes - sorted[i].missed_votes)*sorted[i].votes_with_party_pct/100);
		}
		output += "</td>";
		output += "<td>" + sorted[i][inputPercentageKey];
		output += "</td>";
		output += "</tr>";
		document.getElementById("senateleng").innerHTML = output;

	}
}

function printingTableGlance() {
	document.getElementById("senateAtt").innerHTML = "";
	var output = "";
	output += "<tr>";
	output += "<td>" + "Democrats";
	output += "</td>";
	output += "<td>" + lengthD;
	output += "</td>";
	output += "<td>" + (totalD / lengthD).toFixed(2);
	output += "</td>";
	output += "</tr>";

	output += "<tr>";
	output += "<td>" + "Republicans";
	output += "</td>";
	output += "<td>" + lengthR;
	output += "</td>";
	output += "<td>" + (totalR / lengthR).toFixed(2);
	output += "</td>";
	output += "</tr>";

	output += "<tr>";
	output += "<td>" + "Independent";
	output += "</td>";
	output += "<td>" + lengthI;
	output += "</td>";
	output += "<td>" + (totalI / lengthI).toFixed(2);
	output += "</td>";
	output += "</tr>";

	output += "<tr>";
	output += "<td>" + "Total";
	output += "</td>";
	output += "<td>" + lengthT;
	output += "</td>";
	output += "<td>" + (totalN / lengthT).toFixed(2);
	output += "</td>";
	output += "</tr>";

	document.getElementById("senateAtt").innerHTML = output;
}
