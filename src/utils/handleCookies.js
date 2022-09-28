import Cookies from "js-cookie";

const setCookie = (name, value) => {

    Cookies.set(name, value);

}

const getCookie = (name, value) => {
    let cookie = Cookies.get()

    return cookie
}

const deleteCookie = (name) => {
    Cookies.remove(name)
}

export { setCookie, getCookie, deleteCookie }