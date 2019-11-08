import { JObject, JProperty } from '../decorators';
import { User } from '.';

@JObject()
class Activity {

    @JProperty()
    id: string = '';

    @JProperty()
    initiator: string = '';

    @JProperty()
    stadium: string = '';

    @JProperty()
    fields: string = '';

    @JProperty()
    startTime: number = 0;

    @JProperty()
    endTime: number = 0;

    @JProperty()
    maxPpl: number = 0;

    @JProperty()
    costs: number = 0;

    @JProperty()
    desc: string = '';

    @JProperty(User)
    attendees: User[] = [];

    @JProperty()
    currPpl: number = 0;

    @JProperty()
    status: string = '';
}

export default Activity;