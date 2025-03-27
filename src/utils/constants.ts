import axios from "axios";

export const ARTICLE_PER_PAGE = 6;

export const request = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
