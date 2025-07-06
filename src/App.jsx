import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/ConversationContext";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ConversationPage from "./pages/ConversationPage";

import "./App.css";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <Route path="/" component={IndexPage} exact />
          <Route path="/login" component={LoginPage} exact />
          <Route path="/dashboard" component={DashboardPage} exact />
          <Route path="/conversations/:id" component={ConversationPage} exact />
        </Switch>
      </Router>
    </SocketProvider>
  );
}

export default App;
