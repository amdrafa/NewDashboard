import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/axios";
import Router from "next/router";
import { useToast } from "@chakra-ui/react";
import { parseCookies, destroyCookie, setCookie } from "nookies";
import { decode } from "jsonwebtoken";

export type DecodedToken = {
  id: string;
  sub?: string;
  iat: number;
  exp: number;
  roles: string;
  name: string;
  email: string;
  isForeigner: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  roles: string;
  isForeigner: boolean;
  companyId?: number;
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
  document: string;
  isForeigner: boolean;
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

  const decodedUser = decode(auth as string) as DecodedToken;

  if(auth){
    setUser({
      id: decodedUser.id,
      email: decodedUser.email,
      roles: decodedUser.roles,
      name: decodedUser.name,
      isForeigner: decodedUser.isForeigner
    })

    api.defaults.headers["authorization"] = "Bearer " + auth;

    isAuthenticated = true
  }

    // if (auth) {
    //   api
    //     .get("me")
    //     .then((response) => {
    //       const { name, email, roles, userId, driver_expiration, companyRef, cpf, phone, companyName, permissions } = response.data;
      
    //       setUser({ name, email, roles, companyRef, userId, driver_expiration, cpf, phone, companyName, permissions: permissions ? permissions : [""] });
    //     })
    //     .catch((error) => {
    //       isAuthenticated = false;
    //       signOut();
    //     });
    // }

    if (!auth) {
      isAuthenticated = false;
      api.defaults.headers["authorization"] = "Bearer " + auth;
      Router.push("/");
    }


  }, [statusLogin]);

  useEffect(() => {
    
    statusRegister == 201 && Router.push("/successredirect");
    

    statusRegister == 201 && setStatusRegister(0);
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
      const response = await api.post("/user/login", { email, password });

      setCookie(null, "auth", response.data.token)

      api.defaults.headers["authorization"] = response?.data?.token;
      setStatusLogin(response.status);

      setUser(response.data.user);

      console.log(response)

      toast({
        title: "deu bom",
        description: `Try a valid e-mail and password.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });

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

  async function createUser({ name, email, password, document, phone, isForeigner}: createUserProps) {
    try {
      //setUser({email, name: 'rafael'})
      await api
        .post("/user/create", { email, password, name, document, phone, isForeigner, roles: "user"})
        .then((response) => {
          toast({
            title: "Registration successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });

          Router.push("/");

        });
    } catch (err) {
      console.log(err)
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
