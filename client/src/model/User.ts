import { JObject, JProperty } from '../decorators';

@JObject()
class User {

    @JProperty()
    id: string = '';

    @JProperty()
    name: string = '';

    @JProperty()
    bio: string = '';

    @JProperty()
    time: number = 0;
}

export default User;