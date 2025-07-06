import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route path="/login" render={() => <LoginPage />} />
      </Switch>
    </Router>
  );
}

export default App;
