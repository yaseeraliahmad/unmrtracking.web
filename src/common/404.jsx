import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

export default () => (
  <Page>
    <Navbar title="Not found" backLink="Back"></Navbar>
    <Block>
      <p>Sorry</p>
      <p>Error 404: Page not found.</p>
    </Block>
  </Page>
);
