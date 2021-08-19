import Game from "./pages/Game";
import Lobby from "./pages/Lobby";

import { Switch, Route, BrowserRouter } from 'react-router-dom';

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Lobby} />
        <Route path='/game/:gameId' component={Game} />
      </Switch>
    </BrowserRouter>
  );
}


export default App;
