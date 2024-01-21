import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

export default () => (
  <Page>
    <Navbar title="Server Error" backLink="Back"></Navbar>
    <Block>
      <p>Sorry</p>
      <p>Error 503: Server Error.</p>
    </Block>
  </Page>
);
