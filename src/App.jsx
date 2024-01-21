import React from 'react';
import {App, Block, Button, Link, NavRight, Navbar, Page, Panel, Popup, View} from 'framework7-react';
import routes from './routes.js';
//import store from './store.js';

export default () => {
  let theme = 'auto';
  if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0];
  }
  const needsBrowserHistory = document.location.href.includes('example-preview');

  return (
    <App
      theme={theme}
      routes={routes}
      //store={store}
      popup={{ closeOnEscape: true }}
      sheet={{ closeOnEscape: true }}
      popover={{ closeOnEscape: true }}
      actions={{ closeOnEscape: true }}
      name="Flight Portal - IndiGo"
      panel={{swipe: true}}
    >
    {/*  Main view */}
    <View
        url="/"
        main
        className="safe-areas"
        masterDetailBreakpoint={768}
        browserHistory={needsBrowserHistory}
        browserHistoryRoot={needsBrowserHistory ? '' : ''}
        preloadPreviousPage={!needsBrowserHistory}
        iosSwipeBack={!needsBrowserHistory}
        browserHistorySeparator="#!"
    >
    </View>
  </App>
  )
}
