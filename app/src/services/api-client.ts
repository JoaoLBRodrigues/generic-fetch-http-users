import axios, { CanceledError } from "axios";

export default axios.create({ // exported as default object
    baseURL: 'https://jsonplaceholder.typicode.com/',
    headers: {
        //'api-key': '...'

    }
})

export { CanceledError }