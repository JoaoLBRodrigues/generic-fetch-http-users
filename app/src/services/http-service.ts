import apiClient from "./api-client";

interface IEntity {
    id:number
}
//or export default class userService
class HttpService {

    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll<T>() {
        const controller = new AbortController(); // abort fetch if not needed
        const request = apiClient.get<T[]>(this.endpoint, { signal: controller.signal })
        return { request, cancel: () => controller.abort()}
    } 

    delete (id:number) {
       return apiClient.delete(this.endpoint + '/' + id);   
    }

    addUser<T> (entity: T) {
        return apiClient.post(this.endpoint, entity)
    }

    update<T extends IEntity> (entity: T) {
        return  apiClient.patch(this.endpoint + '/' + entity.id , entity)
    }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;