import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://creative-agency-portal.onrender.com"
);

export const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ""),
  withCredentials: true,
});

let currentAccessToken = null;
export const setAccessToken = (token) => {currentAccessToken = token;
};

// Interceptor request: suntik header Authorization otomatis ke SEMUA request,

// PENTING : sementara gini dulu, nanti di benerin lagi karena 
api.interceptors.request.use((config) =>{
    if(currentAccessToken) config.headers.Authorization = `Bearer ${currentAccessToken}`;
    return config;
})

// Interceptor response: kalau server balas 401 (access token expired),
// otomatis tukar refresh token sekali, lalu ulangi request yang gagal.

// nanti pikirin lagi klo sudah ada mekanisme pengganti refresh. 
// yang auto tukern cookie sama auth login
 
// fix : rekursif request jika tidak terpenuhi, coba teliti lagi 
// api.interceptors.response.use((res) => res, async (err) =>{
//     const original = err.config;
//     if(err.response?.status === 401 && !original._retry){
//         original._retry = true;
//         try{
//             const {data} = await api.post("/auth/refresh");
//             setAccessToken(data.AccessToken);
//             original.headers.Authorization = `Bearer ${data.AccessToken}`;
//             return api(original);
//         }
//         catch {
//             setAccessToken(null);
//             window.location.href = "/login";
//         }
//     }
//     return Promise.reject(err);
//     }
// );

// client/src/api/axios.js (ganti bagian response interceptor)

// Request ke endpoint ini tidak boleh memicu percobaan refresh —
// 401 di sini artinya kredensial salah / refresh token memang tidak valid,
// bukan "access token expired yang bisa ditukar".
const SKIP_REFRESH = ["/auth/login", "/auth/refresh", "/auth/register"];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isAuthEndpoint = SKIP_REFRESH.some((path) => original?.url?.includes(path));

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        setAccessToken(null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
