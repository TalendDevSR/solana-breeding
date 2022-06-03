
const componentStyles = (theme) => ({
  cardRootBgGradient: {
    background:
      "linear-gradient(87deg," +
      theme.palette.dark.main +
      ",#1a174d)!important",
  },
  value: {
    color: "#CD53FC"
  },
  cardRoot: {
    border: "0!important",
  },
  cardHeaderRoot: {
    backgroundColor: "initial!important",
  },
  cardHeaderRoot1: {
    backgroundColor: "#242632",
  },
  textUppercase: {
    textTransform: "uppercase",
  },
  containerRoot: {
    //colorchange
    backgroundColor: "#0a1217",
    // backgroundColor: "#1e2128",
    [theme.breakpoints.up("md")]: {
      paddingLeft: "39px",
      paddingRight: "39px",
    },
  },
  buttonRootUnselected: {
    background: theme.palette.white.main + "!important",
    color: theme.palette.primary.main + "!important",
  },
  gridItemRoot: {
    [theme.breakpoints.up("xl")]: {
      marginBottom: "0!important",
    },
  },
  tableRoot: {
    marginBottom: "0!important",
  },
  tableCellRoot: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    borderTop: "0",
  },
  tableCellRootHead: {
    backgroundColor: '#242632',
    color: theme.palette.gray[600],
  },
  tableCellRootBodyHead: {
    textTransform: "unset!important",
    fontSize: ".8125rem",
  },
  borderBottomUnset: {
    borderBottom: "0!important",
  },
  linearProgressRoot: {
    height: "3px!important",
    width: "120px!important",
    margin: "0!important",
  },
  bgGradientError: {
    background:
      "linear-gradient(87deg," +
      theme.palette.error.main +
      ",#f56036)!important",
  },
  bgGradientSuccess: {
    background:
      "linear-gradient(87deg," +
      theme.palette.success.main +
      ",#2dcecc)!important",
  },
  bgGradientPrimary: {
    background:
      "linear-gradient(87deg," +
      theme.palette.primary.main +
      ",#825ee4)!important",
  },
  bgGradientInfo: {
    background:
      "linear-gradient(87deg," +
      theme.palette.info.main +
      ",#1171ef)!important",
  },
  bgGradientWarning: {
    background:
      "linear-gradient(87deg," +
      theme.palette.warning.main +
      ",#fbb140)!important",
  },
});

export default componentStyles;
