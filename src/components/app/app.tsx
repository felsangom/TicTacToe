import style from './app.module.scss'
import Board from '../board/board'

const App = (): JSX.Element => {
  return (
    <div className={style.app}>
      <header className={style.header}>
        <h1>Tic Tac Toe</h1>
      </header>

      <Board />
    </div>
  )
}

export default App
