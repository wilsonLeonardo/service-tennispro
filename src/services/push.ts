import axios from 'axios';

const notification = axios.create({
  baseURL: 'https://onesignal.com/api/v1/',
  headers: {
    Authorization: 'Basic MzlkNzBhODctOTVjOS00YmMxLTljMmYtNGJjYzM3MTgyOWZi',
    'Content-Type': 'application/json; charset=utf-8',
  },
});
export { notification };
