"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postsStyles = exports.profileStyles = void 0;

var _styles = require("@material-ui/core/styles");

var profileStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    title: {
      marginTop: "1rem",
      textAlign: 'center',
      textTransform: 'capitalize'
    },
    card: {
      '& :hover': {
        backgroundColor: 'transparent !important'
      },
      backgroundColor: '#e9ebee',
      width: '70%'
    },
    profileContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: theme.spacing(3)
    },
    profileImage: {
      width: '100% !important',
      borderRadius: '50%',
      border: '4px solid #FFF',
      maxWidth: 250,
      maxHeight: 250,
      minWidth: 250,
      minHeight: 250,
      margin: '1rem auto 0 auto'
    },
    imageButton: {
      display: 'flex'
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    userDetails: {
      '& button': {
        margin: "".concat(theme.spacing(1), "px 0")
      },
      width: '70%',
      textAlign: 'center',
      margin: "".concat(theme.spacing(2), "px 0")
    },
    editIconBtn: {
      margin: "-52px 0 0 12rem"
    }
  };
});
exports.profileStyles = profileStyles;
var postsStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    cards: {
      margin: theme.spacing(3),
      width: '60%'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: 0
    },
    inputIcon: {
      marginRight: theme.spacing(1)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  };
});
exports.postsStyles = postsStyles;