import Login from './common/login.jsx';
import Home from './common/home.jsx';
import Booking from './common/booking.jsx';
import Details from './common/details.jsx';
import AdminCreateTrip from './admin/create_trip.jsx';
import Passengers from './common/passengers.jsx';
import ServerError from './common/503.jsx';
import PageNotFound from './common/404.jsx';
// Pages
export default [
  // Index page
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login/',
    component: Login,
  },
  {
    path: '/:role/details/:id',
    component: Details,
  },
  {
    path: '/:role/trips/:id/passengers/',
    component: Passengers,
  },
  {
    path: '/:role/booking/',
    component: Booking,
  },
  {
    path: '/admin/create_trip/',
    component: AdminCreateTrip,
  },
  {
    path: '/503/',
    component: ServerError,
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    component: PageNotFound,
  },
  
];
