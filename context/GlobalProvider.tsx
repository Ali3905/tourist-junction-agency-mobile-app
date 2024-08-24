import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosInstance } from "axios";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  userName: string | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  editData: any,
  setDriverId: React.Dispatch<React.SetStateAction<string | null>>;
  driverId: string | null;
  photos: Array<string>
  setPhotos: React.Dispatch<React.SetStateAction<Array<string>>>
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>()
  const [driverId, setDriverId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Array<string>>([])

  const baseURL = process.env.EXPO_PUBLIC_URL as string;

  useEffect(() => {
    SecureStore.getItemAsync("access_token")
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setToken(res);
        } else {
          setToken(token);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

      SecureStore.getItemAsync("driver_id")
      .then((res) => {
        if (res) {
          setDriverId(res);
        }
      })
  }, [token]);

  const apiCaller = axios.create({
    baseURL,
    onUploadProgress: (progressEvent) => { },
    withCredentials: true,
    headers: {
      "authtoken": `${token}`,
    },
  });

  apiCaller.interceptors.response.use(
    (response) => response,
    // (error) => Promise.reject(error?.response?.data?.err),
    (error) => Promise.reject(error),
  );

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        apiCaller,
        token,
        setToken,
        loading,
        userName,
        setUserName,
        setEditData,
        editData,
        driverId,
        setDriverId,
        photos,
        setPhotos
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
