const _ = require("lodash");
const LineByLineReader = require('linebyline');
const UNAVAILBLE = "UNAVAILBLE";
const FREE = "FREE";


function main() {
	global.serversInformations = [];
	readInputFile();
}

function readInputFile() {
	var lr = new LineByLineReader('input.in');

	lr.on('line', function(line, lineCount, byteCount){
		// HEADER
		if(lineCount === 1) {
			initMainVariables(line);
			global.dataCenterMatrix = initMatrix();
		} 
		// UNAVAILABLE SLOTS
		else if(lineCount > 1 && lineCount <= 1 + global.SLOTS_UNAVAILABLE){
			setUnavailableSlots(line);
		} 
		// SERVERS
		else {
			global.serversInformations.push({
				number: lineCount - (1 + global.SLOTS_UNAVAILABLE) -1,
				slots: line.split(" ")[0],
				capacity: line.split(" ")[1]
			});
		}
	});
	lr.on('end', function(){
		completeMatrix();
		var totalCapacity = calculScore(global.dataCenterMatrix);
		console.log(totalCapacity);
	});
	
}

function initMainVariables(line) {
	var header = line.split(" ").map(Number);
	global.ROWS = header[0];
	global.SLOTS = header[1];
	global.SLOTS_UNAVAILABLE = header[2];
	global.POOLS = header[3];
	global.SERVERS = header[4];	
}

function initMatrix() {
	var matrix = new Array(global.ROWS);
	for (var i = 0; i < global.ROWS; i++) {
		matrix[i] = new Array(global.SLOTS);
		for (var j = 0; j < global.SLOTS; j++) {
			matrix[i][j] = FREE;
		}
	}
	return matrix;
}

function setUnavailableSlots(line) {
	var slotUnavailableCoordinates = line.split(" ");
	global.dataCenterMatrix[slotUnavailableCoordinates[0]][slotUnavailableCoordinates[1]] = UNAVAILBLE;
}

function completeMatrix() {

	_.forEach(global.serversInformations, function(server){
		var rowIndex = 0;
		var columnIndex = 0;
		var serverColumnPosition = 0;
		var positionServerFound = false;
		var numberOfAvailableSlots = 0;

		while(rowIndex < ROWS || !positionServerFound) {
			//Slot is available
			if(global.dataCenterMatrix[rowIndex][columnIndex] === FREE){
				numberOfAvailableSlots ++;

				if(numberOfAvailableSlots == server.slots) {
					for(var j = serverColumnPosition; j <= columnIndex; j++){
						global.dataCenterMatrix[rowIndex][j] = server.number;
					}
					numberOfAvailableSlots = 0;
					positionServerFound = true;
					return;
				} else if(columnIndex < SLOTS - 1) {
					columnIndex++;
				} else if (rowIndex < ROWS -1 ){
					rowIndex ++;
					numberOfAvailableSlots = 0;
					serverColumnPosition = 0;
					columnIndex = 0;
				} else {
					return;
				}
			}
			//Slot is not available
			else {
				serverColumnPosition ++;
				numberOfAvailableSlots = 0;
				if(columnIndex < SLOTS - 1) {
					columnIndex++;
				} else if (rowIndex < ROWS - 1){
					rowIndex ++;
					numberOfAvailableSlots = 0;
					columnIndex = 0;
					serverColumnPosition = 0;
				} else {
					return;
				}
			}

		}
	});
	console.log(global.dataCenterMatrix)
}

function calculScore(matrix) {
	var score = 0;
	for (var i = 0 ; i < ROWS; i++) {
		var serversCapacity = _(matrix[i])
			.sortedUniq()
			.remove(function(val){
				return val !== UNAVAILBLE;
			})
			.map(function(number){
				return global.serversInformations[number].capacity;
			})
			.value();
		score += Number(_.min(serversCapacity));
	}
	return score;
}


main();