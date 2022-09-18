import style from './board.module.scss'
import { useCallback, useEffect, useState } from 'react'
import { playerO, playerX, outOfMoves, checkWinner, findBestMove } from '../../ai/logic'

const Board = (): JSX.Element => {
  const initialBoardState = new Array<Array<number | null>>(
    [null, null, null],
    [null, null, null],
    [null, null, null]
  )

  const [gameOver, setGameOver] = useState<boolean>(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<number>(playerO)
  const [boardState, setBoardState] = useState<(number | null)[][]>(initialBoardState)

  const makeMove = useCallback((lineIndex: number, cellIndex: number): void => {
    if (gameOver)
      return

    if (boardState[lineIndex][cellIndex] != null)
      return

    const newBoardState: (number | null)[][] = [...boardState]
    newBoardState[lineIndex][cellIndex] = currentPlayer

    setBoardState(newBoardState)
    setCurrentPlayer(currentPlayer === playerO ? playerX : playerO)
  }, [boardState, currentPlayer, gameOver])

  useEffect(() => {
    let currentBoardState = [...boardState]
    if (checkWinner(currentBoardState) === playerX) {
      setWinner(playerX)
      setGameOver(true)
    } else if (checkWinner(currentBoardState) === playerO) {
      setWinner(playerO)
      setGameOver(true)
    } else if (outOfMoves(currentBoardState)) {
      setGameOver(true)
    } else {
      if (currentPlayer === playerX) {
        let cpuMove = findBestMove(currentBoardState, playerX)
        makeMove(cpuMove[0], cpuMove[1])
      }
    }
  }, [boardState, currentPlayer, makeMove])

  const renderCurrentPlayerOrWinner = (): JSX.Element => {
    if (winner === playerO)
      return <h1>O wins!</h1>
    else if (winner === playerX)
      return <h1>X wins!</h1>
    else if (gameOver)
      return <h1>Game over!</h1>
    else
      return <h1>{currentPlayer === playerX ? 'X' : 'O'} turn</h1>
  }

  const restartGame = (): void => {
    setBoardState(initialBoardState)
    setWinner(null)
    setGameOver(false)
  }

  return (
    <div className={style.board}>
      <table>
        <tbody>
          {
            boardState.map((line: (number | null)[], lineIindex: number) => {
              return (
                <tr key={`line_${lineIindex}`}>
                  {
                    line.map((cell: (number | null), cellIndex: number) => {
                      return <td key={`cell_${lineIindex}_${cellIndex}`} onClick={() => makeMove(lineIindex, cellIndex)}>{cell === playerO ? 'O' : cell === playerX ? 'X' : null}</td>
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className={style.gameState}>
        { renderCurrentPlayerOrWinner() }
        <button onClick={() => restartGame()}>Restart</button>
      </div>
    </div>
  )
}

export default Board
