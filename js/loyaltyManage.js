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

countAndAverage();

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

statistics.least_engaged = getLowestTen(members, "votes_with_party_pct"); // Difference
statistics.most_engaged = getHighestTen(members, "votes_with_party_pct"); // Difference

printTable("votes_with_party_pct", "least_engaged", "senateleng");// Difference
printTable("votes_with_party_pct", "most_engaged", "senatemeng");// Difference
printingTableGlance();

function countAndAverage() {
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
	lengthD = arrayD.length;
	lengthR = arrayR.length;
	lengthI = arrayI.length;
}

function getTenPerc(inputArray, sortingKey, sort) {
	inputArray.sort(sort);
	var number = 0;
	var lowest = [];
	for (var i = 0; i < inputArray.length; i++) {
		if (number <= (inputArray.length / 10)) {
			number++;
			lowest.push(inputArray[i]);
		} else if (inputArray[i][sortingKey] == inputArray[i - 1][sortingKey]) {
			lowest.push(inputArray[i]);
		} else {
			return lowest;
		}
	}
}

function getLowestTen(inputArray, sortingKey) {
	return getTenPerc(inputArray, sortingKey, function (a, b) {
		return a[sortingKey] - b[sortingKey];
	} );
}

function getHighestTen(inputArray, sortingKey) {
	return getTenPerc(inputArray, sortingKey, function (a, b) {
		return b[sortingKey] - a[sortingKey];
	} );
}


function printTable(inputPercentageKey, engagementKey, elementId) {
	document.getElementById(elementId).innerHTML = "";
	var output = "";
	var sorted = statistics[engagementKey];
	for (var i = 0; i < sorted.length; i++) {
		output += "<tr>";
		output += "<td>" + "<a href=" + sorted[i].url + ">" + sorted[i].first_name + " " + (sorted[i].middle_name || "") + " " + sorted[i].last_name;
		output += "</td>" + "</a>";
		if (inputPercentageKey == "missed_votes_pct") {
			output += "<td>" + sorted[i].missed_votes;
		} else if (inputPercentageKey == "votes_with_party_pct") {
			output += "<td>" + Math.round(((sorted[i].total_votes - sorted[i].missed_votes)*sorted[i].votes_with_party_pct/100));
		}
		output += "</td>";
		output += "<td>" + sorted[i][inputPercentageKey];
		output += "</td>";
		output += "</tr>";
		document.getElementById(elementId).innerHTML = output;
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
