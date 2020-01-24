import { Job } from "../job";

export class JobsFoundItem {
    public jobsProvidingSkill: Job[] = [];
    public highestJobFound: Job = null;
    public highestJobLevelFound = 0;
}