import { IRecentRecall } from "../../../recall-alert-api/models/recent-recall";
import { Parameters } from "actions-on-google";

export class RecentRecallsRecentFollowupContext implements Parameters
{
    [parameter: string]: string | Object | undefined;

    /**
     *
     */
    constructor(recalls: IRecentRecall[], count:number) {
        this.parameter = {
            RecentRecalls: recalls,
            Counter: count
        }
    }
}