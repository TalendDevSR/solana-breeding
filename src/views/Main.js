import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./Header";

import {
	ScrollingProvider,
	useScrollSection,
	Section,
} from 'react-scroll-section';

function Main() {
  return (
    <ScrollingProvider>
      <div className="header_container">
        <Header />
      </div>
      <div className="main_container">
        <Header />
      </div>
    </ScrollingProvider>
  );
}

export default Main;
