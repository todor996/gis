import axios from 'axios';

const { API_URL } = process.env;

const instance = axios.create({
  baseURL: 'https://9226baad71d3.ngrok.io',
});



export default instance;
