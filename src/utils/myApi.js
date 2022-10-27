class myApi {
    constructor(url) {
        this.url = url
    }


    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }

        throw new Error(`${res.status}`)

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

    async handleUpdateUserInfo(token, name, email, boards) {
        const response = await fetch(`${this.url}/user`, {
            method: "PUT",
            body: JSON.stringify({
                name: name,
                email: email,
                boards: boards
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

    async handleGetBoards(token) {
        const response = await fetch(`${this.url}/boards`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            }

        })

        return this._checkResponse(response)
    }

    async handleAddNewBoard(token, title) {
        const response = await fetch(`${this.url}/boards`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title
            })


        })

        return this._checkResponse(response)
    }

    async handleDeleteBoard(token, id) {
        const response = await fetch(`${this.url}/boards/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            },
        })

        return this._checkResponse(response)
    }

    async handleUpdateBoard(token, id, title, containers) {
        const response = await fetch(`${this.url}/boards/${id}`, {
            method: "PATCH",
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                containers: containers
            })
        })

        return this._checkResponse(response)
    }
}

const url = 'http://localhost:3001'
export const Api = new myApi(url)