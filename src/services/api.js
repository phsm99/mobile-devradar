import axios from 'axios';

const api = axios.create({
    baseURL: 'https://devradar-pedro.herokuapp.com//',
});

export default api;