const _ = require("lodash");
const LineByLineReader = require('linebyline');
const UNAVAILBLE = "UNAVAILBLE";

function main() {
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

		}
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
	var matrix = new Array(global.SLOTS);
	for (var i = 0; i < global.SLOTS; i++) {
		matrix[i] = new Array(global.ROWS);
	}
	return matrix;
}

function setUnavailableSlots(line) {
	var slotUnavailableCoordinates = line.split(" ");
	global.dataCenterMatrix[slotUnavailableCoordinates[0]][slotUnavailableCoordinates[1]] = UNAVAILBLE;
}



main();