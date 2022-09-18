const playerX = 1
const playerO = -1

const outOfMoves = (boardState: (number | null)[][]): boolean => {
  let hasMovesLeft = false
  boardState.forEach((line: (number | null)[]) => {
    if (line.includes(null))
      hasMovesLeft = true
  })

  return !hasMovesLeft
}

const checkWinner = (boardState: (number | null)[][]): number => {
  // Check lines first
  for (let lineIndex: number = 0; lineIndex < boardState.length; lineIndex++) {
    if (boardState[lineIndex][0] !== null)
      if (boardState[lineIndex][0] === boardState[lineIndex][1] && boardState[lineIndex][1] === boardState[lineIndex][2])
        return boardState[lineIndex][0] || 0
  }

  // Transpose board and check lines again
  const transposedBoardState = boardState[0].map((_, colIndex) => boardState.map(row => row[colIndex]))
  for (let lineIndex: number = 0; lineIndex < transposedBoardState.length; lineIndex++) {
    if (transposedBoardState[lineIndex][0] !== null)
      if (transposedBoardState[lineIndex][0] === transposedBoardState[lineIndex][1] && transposedBoardState[lineIndex][1] === transposedBoardState[lineIndex][2])
        return transposedBoardState[lineIndex][0] || 0
  }

  // Check diagonals
  if (boardState[1][1] !== null) {
    let center = boardState[1][1]
    if ((boardState[0][0] === center && boardState[2][2] === center) || (boardState[0][2] === center && boardState[2][0] === center))
      return center
  }

  return 0
}

/*
 * MinMax logic from https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
 */
const minMax = (boardState: (number | null)[][], depth: number, isMax: boolean, player: number): number => {
  let score = checkWinner(boardState)

  if (score !== 0)
    return score

  if (outOfMoves(boardState))
    return 0

  if (isMax) {
    let best = -Infinity

    boardState.forEach((line: (number | null)[], lineIndex: number) => {
      line.forEach((cell: (number | null), cellIndex: number) => {
        if (cell === null) {
          boardState[lineIndex][cellIndex] = player
          best = Math.max(best, minMax(boardState, depth + 1, !isMax, player))
          boardState[lineIndex][cellIndex] = null
        }
      })
    })

    return best
  } else {
    let best = Infinity

    boardState.forEach((line: (number | null)[], lineIndex: number) => {
      line.forEach((cell: (number | null), cellIndex: number) => {
        if (cell === null) {
          boardState[lineIndex][cellIndex] = (player === playerO ? playerX : playerO)
          best = Math.min(best, minMax(boardState, depth + 1, !isMax, player))
          boardState[lineIndex][cellIndex] = null
        }
      })
    })

    return best
  }
}

const findBestMove = (boardState: (number | null)[][], player: number): number[] => {
  let bestMove = -Infinity
  let bestMovePosition = [-1, -1]

  boardState.forEach((line: (number | null)[], lineIndex: number) => {
    line.forEach((cell: (number | null), cellIndex: number) => {
      if (cell === null) {
        boardState[lineIndex][cellIndex] = player
        let moveScore = minMax(boardState, 0, false, player)
        boardState[lineIndex][cellIndex] = null

        if (moveScore > bestMove) {
          bestMovePosition = [lineIndex, cellIndex]
          bestMove = moveScore
        }
      }
    })
  })

  return bestMovePosition
}

export { playerO, playerX, outOfMoves, checkWinner, findBestMove }
