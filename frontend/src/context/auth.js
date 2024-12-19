import {createContext,useContext,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';     

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user, setUser] = useState(() => {
        // Initialize user from localStorage or null
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate =useNavigate();
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        console.log(storedUser,token);
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const login = async (email,password) => {
        try{
            const res = await fetch('http://localhost:4000/login' ,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email,password}),
            });
            const data = await res.json();
            if(res.ok){
                setUser(data.user);
                setIsLoggedIn(true);
                console.log(data.user);
                localStorage.setItem('token',data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log("data=",localStorage.getItem('token'))
                navigate('/dashboard');
            }else{
                alert(data.message);
            }
        }catch(error){
            console.error('login error',error);
        }
    }
    const signup = async({username ,email, password}) => {
        try{ 
            console.log(email)
            const res = await fetch('http://localhost:4000/signup' ,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,email,password}),
            });
            const data = await res.json();
            if(res.ok){
                setUser(data.user);
                setIsLoggedIn(true);
                localStorage.setItem('token',data.token);
                navigate('/dashboard');
            }else{
                alert(data.message);
            }
        }catch(error){
            console.error('signup error',error);
        }
    };
    const logout = () =>{
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
        console.log(localStorage.getItem('token'))
        console.log("looged out")
    }
    return(
        <AuthContext.Provider value={{user ,login, signup, logout, isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);