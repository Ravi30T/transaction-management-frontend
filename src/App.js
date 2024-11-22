import { Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';

import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import TransactionDetails from './components/TransactionDetails';
import Profile from './components/Profile';
import './App.css';

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Register} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path={`/transaction-details/:id`} component={TransactionDetails} />
    <ProtectedRoute exact path='/profile' component={Profile} />
  </Switch>
)

export default App;
