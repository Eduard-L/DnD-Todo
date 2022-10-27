

export const serverMessages = {
    notFound: {
        message: 'The Asset is not found by the server, try to refresh the page',
        isOpen: true,
        severity: "error"
    },

    unauthorized: {
        message: 'email/password is wrong , try to login again ',
        isOpen: true,
        severity: "error"
    },

    serverError: {
        message: 'Server error please try again later',
        isOpen: true,
        severity: "error"
    },

    BadRequest: {
        message: 'Bad request you data is invalid',
        isOpen: true,
        severity: "error"
    },

    success: {
        message: 'Data saved successfully',
        isOpen: true,
        severity: "success"
    },

    forbiden: {
        message: 'You dont have permission for this operation',
        isOpen: true,
        severity: "warning"
    },

    conflictError: {
        message: 'This Email is already excist, use new one',
        isOpen: true,
        severity: "error"
    },
    serverNotConnected: {
        message: 'Server error, please try again later',
        isOpen: true,
        severity: "error"
    }


}

const darkColor = '#03e9f4';
const darkModeBackGround = 'linear-gradient(#141e30, #243b55)';

const lightColor = 'black'
const ligthModeBackGround = 'white';

const darkContainerColor = 'lightskyblue'


const DARK = 'dark';
const LIGHT = 'light';







export {

    DARK,
    LIGHT,
    darkColor,
    darkModeBackGround,
    lightColor,
    ligthModeBackGround,
    darkContainerColor

}

