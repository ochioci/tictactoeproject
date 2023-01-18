let playerLetter = ""
		let playerTurn = false;
		let lastCPUMove = -1;
		let alreadyMoved = false;
		let lastTileUsed = [-1,-1]
		let boardData = [ //0 = none, 11 = single x, 12 = double x, 21 = single o, 22 = double o. 
			[0,0,0],
			[0,0,0],
			[0,0,0]
		]
		let startMenu, board, xButton, resetButton, oButton, winInfoArea, tiles
		function init() {
			console.log("Initializing Program")
			startMenu = document.getElementById("startMenu");
			board = document.getElementById("board");
			xButton = document.getElementById("X");
			resetButton=document.getElementById("reset");
			resetButton.addEventListener("click", reset);
			oButton = document.getElementById("O");
			videoItem = document.querySelector("video")
			winInfoArea = document.getElementById("winInfoArea");


			// tiles

			tiles = document.querySelectorAll("center div");
            [...tiles].map(tile => tile.addEventListener("click", handleMove))


			xButton.addEventListener("click", beginGame);
			oButton.addEventListener("click", beginGame); 


		}

	

		function handleWin(message) {
			winInfoArea.innerText = `${message} \nPress restart to play again!`
		}

		function reset() {
			playerTurn = false;
			winInfoArea.innerText = ""
			lastCPUMove = -1;
			alreadyMoved = false;
			lastTileUsed = [-1,-1]
			boardData = [[0,0,0],[0,0,0],[0,0,0]]
			updateBoardGUI();
		}


		function beginGame(e) {
			if (e.target.id === "X") {
				playerLetter = "X"
				playerTurn = true;
			} else if (e.target.id === "O") {
				playerLetter = "O"
				playerTurn = false;
				handleCPUMove();
			}
			videoItem.style.display="none"
			startMenu.style.display = "none";
			board.style.display = "grid";
		}

		function handleMove(e) { // none = 0, x = 11, xx == 21, o = 12, oo = 22 
			let row,col 
			if (playerTurn) {
				let tileNum = parseInt(e.target.id) - 1;
				row = (tileNum - (tileNum % 3)) / 3; 
				col = tileNum % 3;
				let val = boardData[row][col]
			
				if (lastTileUsed[0] === row && lastTileUsed[1] === col) {
					console.log("this tile is locked")
					return
				}
				lastTileUsed = [row, col]
				if (val === 0) {
                    boardData[row][col] = (playerLetter === "X") ? 11 : 12;
				}

				else if (playerLetter === "X") {
					if (val === 11) {
						boardData[row][col] = 21;
					} else if (val === 12 ){
						boardData[row][col] = 11;
					} else {
						console.log("invalid move!");
						return
					}
				}

				else if (playerLetter === "O") {
					if (val === 11) {
						boardData[row][col] = 12;
					} else if (val === 12) {
						boardData[row][col] = 22;
					} else {
						console.log("invalid move!");
						return
					}
				}
			playerTurn = false;
			} else {
				console.log("not your turn!");
			}
			updateBoardGUI();
			if (checkForWin(row, col) != "nope") {
				handleWin("WINNER: " + checkForWin(row, col)) 
			} else {
				handleCPUMove();
			}
			
		}


	


		function handleCPUMove() { // none = 0, x = 11, xx == 21, o = 12, oo = 22 
			let availableTiles = []
			for (let i = 0; i < boardData.length; i++) {
				for (let n = 0; n < boardData[i].length; n++) {

					if (i != lastTileUsed[0] || n != lastTileUsed[1]) {
						if (boardData[i][n] != 21 && boardData[i][n] != 22) {
							availableTiles.push([i,n])
						}
					}

					

				}
			}

			let randTileIndex = Math.floor(Math.random() * availableTiles.length)
			let chosenTile = availableTiles[randTileIndex]
			let chosenTileOnBoard = boardData[chosenTile[0]][chosenTile[1]]
			// console.log("AI Move: ")
			if (playerLetter === "X") {
				if (chosenTileOnBoard  === 11 || chosenTileOnBoard === 0) { //x or none
					boardData[chosenTile[0]][chosenTile[1]] = 12
					// console.log(1)
				} if (chosenTileOnBoard === 12 ) {
					boardData[chosenTile[0]][chosenTile[1]] = 22
					// console.log(2)
				}
			} else if (playerLetter === "O") {
				if (chosenTileOnBoard  === 12 || chosenTileOnBoard === 0) { // o or none
					boardData[chosenTile[0]][chosenTile[1]] = 11
					// console.log(3)
				} if (chosenTileOnBoard === 11) {
					boardData[chosenTile[0]][chosenTile[1]] =  21
					// console.log(4)
				}
			}
			// console.log("changed tile: (" + chosenTile[0] + "," + chosenTile[1] + ") from " + chosenTileOnBoard + " to " + boardData[chosenTile[0]][chosenTile[1]])
		

			lastTileUsed = [chosenTile[0], chosenTile[1]]
			
			if (checkForWin(chosenTile[0], chosenTile[1]) != 'nope') {
				handleWin("WINNER:" + checkForWin(chosenTile[0], chosenTile[1]))
			} else {playerTurn = true;}

			updateBoardGUI()

		}

		function getMockBoard () {
			mockBoard = [[],[],[]]
			for (let i = 0; i < boardData.length; i++) {
				for (let n = 0; n < boardData[i].length; n++) {
					if (boardData[i][n] === 11 || boardData[i][n] === 21) {
						mockBoard[i][n] = "X"
					} else if (boardData[i][n] === 12 || boardData[i][n] === 22) {
						mockBoard[i][n] = "O"
					} else {
						mockBoard[i][n] = Math.random();
					}
				}
			}
			console.log(mockBoard)
			return mockBoard
		}


		function checkForWin (row, col) {
			//currently not working
			let tboard = getMockBoard() // replaces "XX" with "X", etc for easier comparison.
			console.log(row + ", " + col)

			//horizontal checks
			if (tboard[0][0]== tboard[0][1] && tboard[0][1] == tboard[0][2]) {
				console.log("!!!!")
				return tboard[0][0];
			}
			if (tboard[1][0]==tboard[1][1] && tboard[1][1] == tboard[1][2]) {
				console.log("!!!!")

				return tboard[1][0];
			}
			if (tboard[2][0]===tboard[2][1] && tboard[2][1] ===tboard[2][2]) {
				console.log("!!!!")

				return tboard[2][0];
			}

			//diagonal checks
			if (tboard[0][0] === tboard[1][1] && tboard[1][1] == tboard [2][2]) {
				return tboard[0][0]
			}
			if (tboard[0][2] === tboard[1][1] && tboard[1][1] == tboard [2][0]) {
				return tboard[1][1]
			}

			//vertical checks

			if (tboard[0][0] == tboard [1][0] && tboard[1][0] == tboard [2][0]) {
				return tboard[0][0]
			}
			if (tboard[0][1] == tboard[1][1] && tboard[1][1] == tboard[2][1]) {
				return tboard[0][1]
			}
			if (tboard[0][2] == tboard[1][2] && tboard[1][2] == tboard[2][2]) {
				return tboard[0][2]
			}


		


			return "nope";

			
			
		}

		

		function updateBoardGUI() {
			 // none = 0, x = 11, xx == 21, o = 12, oo = 22 
			for (let i = 0; i < boardData.length; i++) {
				for (let n = 0; n < boardData[i].length; n++) {
					let tval = boardData[i][n];
					if (tval === 0) {		
						updateTile( (i*3) + n, " - ")
						
					} else if (tval === 11)  {
						console.log()
						updateTile( (i*3) + n, " X ")
					}
					else if (tval === 21) { 
						updateTile( (i*3) + n, " XX ")
					} else if (tval === 12)  {
						updateTile( (i*3) + n, " O " )
					}
					else if (tval === 22) { 
						updateTile( (i*3) + n, " OO ")
					}
					
				}
			}
		}

		function updateTile(tileIndex, value) {
			tiles[tileIndex].innerText = value;
		}

	
	
		window.addEventListener("DOMContentLoaded", init);