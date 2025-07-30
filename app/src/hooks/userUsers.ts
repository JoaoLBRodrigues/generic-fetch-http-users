import { CanceledError } from "axios";
import { useEffect, useState } from "react";
import userService ,{ type IUser} from '../services/userService';

const useUsers = () => {
const [users, setUser] = useState<IUser[]>([]);
const [isLoading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
        setLoading(true);
        const { request, cancel } = userService.getAll<IUser>();
        request
            .then((res) => setUser(res.data))
            .catch((err) => {
                if (err instanceof CanceledError) return; //this only work with axios
                setError(err);
            })
            .finally(() => setLoading(false));

        return () => cancel();
    }, []);
    
    return {users, isLoading, error, setUser, setLoading, setError}   
}

export default useUsers;