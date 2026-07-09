import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("khudeeUser");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  // LOGIN

  const login = (data) => {

    localStorage.setItem(
      "khudeeUser",
      JSON.stringify(data)
    );

    setUser(data);

  };

  // UPDATE USER

  const updateUser = (updatedUser) => {

    const newData = {

      ...user,

      user: {

        ...user.user,

        ...updatedUser,

      },

    };

    localStorage.setItem(
      "khudeeUser",
      JSON.stringify(newData)
    );

    setUser(newData);

  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem(
      "khudeeUser"
    );

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{

        user,

        login,

        logout,

        updateUser,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);