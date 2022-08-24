import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/axios";
import Router from "next/router";
import { useToast } from "@chakra-ui/react";
import { parseCookies, destroyCookie } from "nookies";

type User = {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  permissions?: string[];
  companyRef: string;
  driver_expiration?: string;
  cpf: string;
  phone: string;
  companyName: string;
};

interface LogInCreateContextProps {
  isAuthenticated: boolean;
  createUser: (user: createUserProps) => void;
  loginAuth: (user: loginProps) => void;
  signOut: () => void;
  user: User;
}

type loginProps = {
  email: string;
  password: string;
};

type createUserProps = {
  name: string;
  email: string;
  password: string;
  phone: number;
  cpf: number;
  register_number?: number;
  driver_category?: string;
  expires_at?: Date;
};

type authProviderProps = {
  children: ReactNode;
};

export const LoginContext = createContext({} as LogInCreateContextProps);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "auth");
  api.defaults.headers["authorization"] = "";

  authChannel.postMessage("signout");

  Router.push("/");
}

export function LoginContextProvider({ children }: authProviderProps) {
  const [user, setUser] = useState<User>();
  const [statusRegister, setStatusRegister] = useState(0);
  const [statusLogin, setStatusLogin] = useState(0);
  let isAuthenticated = !!user;

  const toast = useToast()

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signout":
          signOut();
          break;
         default: 
         break; 
      }
    };
  }, []);

  useEffect(() => {
    const { auth } = parseCookies();

    if (auth) {
      api
        .get("me")
        .then((response) => {
          const { name, email, roles, userId, driver_expiration, companyRef, cpf, phone, companyName, permissions } = response.data;
      
          setUser({ name, email, roles, companyRef, userId, driver_expiration, cpf, phone, companyName, permissions: permissions ? permissions : [""] });
        })
        .catch((error) => {
          isAuthenticated = false;
          signOut();
        });
    }

    if (!auth) {
      isAuthenticated = false;
      api.defaults.headers["authorization"] = "";
      Router.push("/");
    }
  }, [statusLogin]);

  useEffect(() => {
    {
      statusRegister == 200 && Router.push("/successredirect");
    }
  }, [statusRegister]);

  useEffect(() => {
    
    {
      if(statusLogin == 200){

        toast({
          title: "Logged in",
          description: `You will be redirected to home page.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
  
        Router.push("/home");

      }
      
    }
  }, [statusLogin]);

  async function loginAuth({ email, password }: loginProps) {
    try {
      const response = await api.post("login", { data: email, password });

      const { auth } = parseCookies();
      api.defaults.headers["authorization"] = auth;
      setStatusLogin(response.status);
    } catch (err) {
      console.log(err);
      toast({
        title: "E-mail or password incorrect",
        description: `Try a valid e-mail and password.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  async function createUser({ name, email, password, cpf, phone, register_number, driver_category, expires_at }: createUserProps) {
    try {
      //setUser({email, name: 'rafael'})
      await api
        .post("createuser", { data: email, password, name, cpf, phone, register_number, driver_category, expires_at})
        .then((response) => setStatusRegister(response.status));
    } catch (err) {
      setStatusRegister(err.response.status);
      toast({
        title: "E-mail already registered",
        description: `Try another e-mail. If the problem persists, contact the support`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      console.log(err)
    }
  }

  //isAutenticated e User (com informações do user) devem ser retornados dentro de mais um objeto
  // exemplo value={{createUser, user, isAutenticated } }>
  return (
    <LoginContext.Provider
      value={{ createUser, loginAuth, user, isAuthenticated, signOut }}
    >
      {children}
    </LoginContext.Provider>
  );
}
