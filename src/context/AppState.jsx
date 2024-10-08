import React from "react";
import AppContext from "./AppContext";

const AppState = (props) => {
  return <AppContext.Provider value={{}}>{props.children}</AppContext.Provider>;
};

export default AppState;
