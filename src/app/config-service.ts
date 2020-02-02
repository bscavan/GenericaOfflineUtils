import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'


@Injectable()
export class ConfigService {
    public static readonly ASSETS_FILES_PATH_ROOT = "./assets/import/";
    // FIXME: Create the rest of these master json files...
    // TODO: Apply alphabetic sorting of job and skill lists after importing?
    public static readonly CLASS_SKILLS_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterClassSkillsList.json";
    public static readonly GENERIC_SKILLS_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterGenericSkillsList.json";
    public static readonly JOBS_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterJobsList.json";
    public static readonly Characters_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterCharactersList.json";

    private _classSkillsJson;
    private _genericSkillsJson;
    private _jobsJson;

    constructor(private _http: Http) { }

    loadJobsAssetFile() {
        return new Promise((resolve, reject) => {
            this._http.get(ConfigService.JOBS_JSON_PATH)
            .map(res => res.json())
            .subscribe((data) => {
                // FIXME: Make this _NOT_ break everything on startup if the file can't be found...
                this._jobsJson = data;
                resolve(true);
            },
            (error: any) => {
                console.error(error);
                return Observable.throw(error.json().error || 'Server error');
            });
        });
    }

    loadClassSkillsAssetFile() {
        return new Promise((resolve, reject) => {
            this._http.get(ConfigService.CLASS_SKILLS_JSON_PATH)
            .map(res => res.json())
            .subscribe((data) => {
                // FIXME: Make this _NOT_ break everything on startup if the file can't be found...
                this._classSkillsJson = data;
                resolve(true);
            },
            (error: any) => {
                console.error(error);
                return Observable.throw(error.json().error || 'Server error');
            });
        });
    }

    loadGenericSkillsAssetFile() {
        return new Promise((resolve, reject) => {
            this._http.get(ConfigService.GENERIC_SKILLS_JSON_PATH)
            .map(res => res.json())
            .subscribe((data) => {
                // FIXME: Make this _NOT_ break everything on startup if the file can't be found...
                this._genericSkillsJson = data;
                resolve(true);
            },
            (error: any) => {
                console.error(error);
                return Observable.throw(error.json().error || 'Server error');
            });
        });
    }

    public getJobsJson() {
        return this._jobsJson;
    }

    public getClassSkillsJson() {
        return this._classSkillsJson;
    }

    public getGenericSkillsJson() {
        return this._genericSkillsJson;
    }
}

export function JobsConfigFactory(configService: ConfigService) {
    return () => configService.loadJobsAssetFile();
}

export function initJobAssets() {
    return {
        provide: APP_INITIALIZER,
        useFactory: JobsConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const JobsConfigModule = {
    init: initJobAssets
}

export function ClassSkillsConfigFactory(configService: ConfigService) {
    return () => configService.loadClassSkillsAssetFile();
}

export function initClassSkillAssets() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ClassSkillsConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ClassSkillsConfigModule = {
    init: initClassSkillAssets
}

export function GenericSkillsConfigFactory(configService: ConfigService) {
    return () => configService.loadGenericSkillsAssetFile();
}

export function initGenericSkillAssets() {
    return {
        provide: APP_INITIALIZER,
        useFactory: GenericSkillsConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const GenericSkillsConfigModule = {
    init: initGenericSkillAssets
}

export { JobsConfigModule, ClassSkillsConfigModule, GenericSkillsConfigModule };