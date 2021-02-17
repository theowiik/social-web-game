import "./App.css";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import Lobby from "./use-cases/Lobby";
import Home from "./use-cases/Home";
import PresentWord from "./use-cases/PresentWord";
import GameSettings from "./use-cases/GameSettings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/lobby" component={Lobby} exact />
        <Route path="/present-word" component={PresentWord} exact/>
        <Route path="/game-settings" component={GameSettings} exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
