const _ = require("lodash");
const LineByLineReader = require('linebyline');
const UNAVAILBLE = "UNAVAILBLE";


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
		//console.log(global.dataCenterMatrix)

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
	}
	return matrix;
}

function setUnavailableSlots(line) {
	var slotUnavailableCoordinates = line.split(" ");
	global.dataCenterMatrix[slotUnavailableCoordinates[0]][slotUnavailableCoordinates[1]] = UNAVAILBLE;
}

function completeMatrix() {
		var rowIndex = 0;
		var columnIndex = 0;
		var serverColumnPosition = 0;

		var numberOfAvailableSlots = 0;

	_.forEach(global.serversInformations, function(server){
		console.log(server)
		
		var numberOfAvailableSlots = 0;
		while(rowIndex < ROWS) {
			//Slot is available
			if(_.isNil(global.dataCenterMatrix[rowIndex][columnIndex])){
				numberOfAvailableSlots ++;

				if(numberOfAvailableSlots == server.slots) {
					for(var j = serverColumnPosition; j <= columnIndex; j++){
						global.dataCenterMatrix[rowIndex][j] = "Server"+ server.number;
					}
					numberOfAvailableSlots = 0;
					return;
				} else if(columnIndex < SLOTS) {
					columnIndex++;
				} else if (rowIndex < ROWS){
					rowIndex ++;
					numberOfAvailableSlots = 0;
					columnIndex = 0;
				} else {
					return;
				}
			}
			//Slot is not available
			else {
				serverColumnPosition ++;
				numberOfAvailableSlots = 0;
				if(columnIndex < SLOTS) {
					columnIndex++;
				} else if (rowIndex < ROWS){
					rowIndex ++;
					numberOfAvailableSlots = 0;
					columnIndex = 0;
				} else {
					return;
				}
			}
		}
	});
	console.log(global.dataCenterMatrix)
}


main();