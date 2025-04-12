import axios from "axios";

export const ARTICLE_PER_PAGE = 6;

export const request = axios.create({
  baseURL: "https://ampere-five.vercel.app/api",
  withCredentials: true,
});
