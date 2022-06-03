const componentStyles = (theme) => ({
  header: {
    position: "relative",
    //colorchange
    backgroundColor: "#0a1217",
    // backgroundColor: "#1e2128",
    paddingBottom: "8rem",
    paddingTop: "3rem",
    [theme.breakpoints.up("md")]: {
      paddingTop: "8rem",
    },
  },
  containerRoot: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
});

export default componentStyles;
