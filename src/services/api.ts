 import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/StorageAuthToken';
import { AppError } from '@utils/AppError';
import axios, { AxiosInstance } from 'axios';

type SignOut = () => void;

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

type processQueueParams = {
  error: Error | null;
  token: string | null;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: 'http://192.168.3.67:3333',
}) as APIInstanceProps;

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

const processQueue = ({ error, token = null }: processQueueParams): void => {
  failedQueue.forEach(request => {
    if(error){
      request.reject(error);
    } else {
      request.resolve(token);
    }

    failedQueue = [];
  })
};

api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
    if(requestError?.response?.status === 401){
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid'){
        const  { refresh_token }  = await storageAuthTokenGet();

        if(!refresh_token){
          signOut();
          return Promise.reject(requestError);
        }

        const originalRequest = requestError.config;
        
        if(isRefreshing){
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((error) => {
            throw error;
          })
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/sessions/refresh-token', { token: refresh_token });
            await storageAuthTokenSave(data.token);
  
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
  
            processQueue({ error: null, token: data.token });
            resolve(originalRequest);

          } catch(error: any){
            processQueue({ error, token: null });
            signOut();
            reject(error);

          } finally {
            isRefreshing = false;
            
          }

        });

      }


      signOut();
    }

    if(requestError.response && requestError.response.data){
      return Promise.reject(new AppError(requestError.response.data.message));
    } else {
      return Promise.reject(requestError);
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
}






export { api };