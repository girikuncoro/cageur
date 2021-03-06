import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';

// App
import App from './app';

/* Pages */
// Mailbox
import Outbox from './routes/Outbox';
import Sent from './routes/Sent';
import Scheduled from './routes/Scheduled';
import Mail from './routes/Mail';
import Compose from './routes/Compose';

// Patient Information
import PatientInfo from './routes/PatientInfo';

// Analytics
import Analytics from './routes/Analytics';

// Login UI
import Login from './routes/Login';

// User Profile
import Profile from './routes/Profile';

const routes = (
  <Route path="/dashboard" component={App}>
    <Route path='mailbox/outbox' component={Outbox}>
        <Route path='sent' component={Sent} />
        <Route path='scheduled' component={Scheduled}/>
    </Route>
    <Route path='mailbox/mail/:group_name/:status/:content/:date/:origin' component={Mail} />
    <Route path="mailbox/compose" component={Compose} />
    <Route path="patient-information" component={PatientInfo} />
    <Route path="analytics" component={Analytics} />
    <Route path="profile" component={Profile} />
  </Route>
);

const basicRoutes = (
  <Route path='/'>
    <IndexRoute component={Login}/>
    <Route path='login' component={Login} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
);

export default (
  <Route>
      {combinedRoutes}
  </Route>
);
