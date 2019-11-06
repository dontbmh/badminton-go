import { JObject, JProperty } from '../decorators';

@JObject()
class Activity {

    @JProperty()
    id: number = 0;

    @JProperty()
    attendees: number[] = [];

    @JProperty()
    costTtl: number = 0;

    @JProperty()
    costPpl: number = 0;

    @JProperty()
    startTime: number = 0;

    @JProperty()
    endTime: number = 0;

    @JProperty()
    status: string = '';
}

export default Activity;