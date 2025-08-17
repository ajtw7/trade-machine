import css from './App.css';
import TeamsList from './components/TeamsList';
import PlayersList from './components/PlayersList';


function App() {
  return (
    <div className="App">
      <h1>Trade Machine</h1>
      <div className="wrapper">
        <TeamsList className="panelContent" />
        <PlayersList className="panelContent" />
      </div>
    </div>
  );
}

export default App;
