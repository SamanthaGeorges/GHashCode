const _ = require("lodash");
const LineByLineReader = require('linebyline');

function main() {
	readInputFile();
}

function readInputFile() {
	var lr = new LineByLineReader('input.in');

	lr.on('line', function(line, lineCount, byteCount){
		//HEADER
		if(lineCount === 1) {
			var header = line.split(" ").map(Number);
			initMainVariables(header);
		}
	})
}

function initMainVariables(header){
	global.ROWS = header[0];
	global.SLOTS = header[1];
	global.SLOTS_UNAVAILABLE = header[2];
	global.POOLS = header[3];
	global.SERVERS = header[4];
}

main();