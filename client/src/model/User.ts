import { JObject, JProperty } from '../decorators';

@JObject()
class User {
    @JProperty()
    id: number = 0;

    @JProperty()
    name: string = '';

    @JProperty()
    status: string = '';

    @JProperty()
    avatarUrl: string = '';
}

export default User;