import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import IndexPage from "./pages/IndexPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={IndexPage} exact />
      </Switch>
    </Router>
  );
}

export default App;
