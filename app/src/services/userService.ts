import apiClient from "./api-client";

export interface IUser {
    id: number;
    name: string | undefined;
    username?: string;
    email?: string;
    phone?: number;
    webSite?: string;
}
//or export default class userService
export default new class UserService {

     getAllUsers () {
		const controller = new AbortController(); // abort fetch if not needed
        const request = apiClient.get("/users", { signal: controller.signal })
        return { request, cancel: () => controller.abort()}
    } 

    deleteUsers (id:number) {
       return apiClient.delete(`users/${id}`);   
    }

    editUsers (user:IUser, updatedUser:IUser) {
        return  apiClient.patch(`users/${user.id}`, updatedUser)
    }

    addUser (data:IUser) {
        return apiClient.post(`users`, data)
    }
}