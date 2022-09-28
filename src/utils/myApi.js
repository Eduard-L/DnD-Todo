class myApi {
    constructor(url) {
        this.url = url
    }


    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }

        Promise.reject(`something went wrong with the server ${res.status}`)
    }
    async createNewUser(values) {
        const { name, email, password } = values

        const response = await fetch(`${this.url}/signup`, {
            method: "POST",

            body: JSON.stringify({
                "email": email,
                "password": password,
                "name": name

            }),
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
        })

        return this._checkResponse(response)
    }

    async handleLog(values) {

        const { email, password } = values

        const response = await fetch(`${this.url}/signin`, {
            method: "POST",

            body: JSON.stringify({
                "email": email,
                "password": password,


            }),
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
        })

        return this._checkResponse(response)

    }

    async getUserInfo(token) {
        const response = await fetch(`${this.url}/user`, {
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            }
        })

        return this._checkResponse(response)
    }

    async createNewContainer(title, token, seq) {
        const response = await fetch(`${this.url}/container`, {
            method: "POST",
            body: JSON.stringify({
                title: title,
                seq: seq
            }),
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        })

        return this._checkResponse(response)
    }

    async getAllContainer(token) {
        const response = await fetch(`${this.url}/containers`, {

            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        })
        return this._checkResponse(response)
    }

    async handleDeleteCon(token, id) {

        const response = await fetch(`${this.url}/containers/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        })

        return this._checkResponse(response)
    }

    async handleUpdateCon(token, id, seq) {
        const response = await fetch(`${this.url}/containers/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                seq: seq
            }),
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        })
        return this._checkResponse(response)
    }

    async handleUpdateUserInfo(token, name, email, containers) {
        const response = await fetch(`${this.url}/user`, {
            method: "PUT",
            body: JSON.stringify({
                name: name,
                email: email,
                containers: containers
            }),
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        })
        return this._checkResponse(response)
    }

    async handleAddNewTasK(token, id, title) {
        const response = await fetch(`${this.url}/containers/${id}/task`, {
            method: "POST",
            body: JSON.stringify({
                title: title
            }),
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        });

        return this._checkResponse(response)

    }

    async handleDeleteTasK(token, id, taskId) {
        const response = await fetch(`${this.url}/containers/${id}/task/${taskId}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }
        });

        return this._checkResponse(response)

    }
}
const url = 'http://localhost:3001'
export const Api = new myApi(url)