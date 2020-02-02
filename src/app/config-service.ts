import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'


//import { environment } from 'environments/environment'; //path to your environment files

@Injectable()
export class ConfigService {

    //private _config: Object
    //public _config: Object
    private _env: string;

    public static readonly ASSETS_FILES_PATH_ROOT = "./assets/import/";
    public static readonly SKILLS_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterSkillsList.json";
    public static readonly JOBS_JSON_PATH = ConfigService.ASSETS_FILES_PATH_ROOT + "masterJobsList.json";;

    private skillsJson;
    private _jobsJson;

    constructor(private _http: Http) { }

    loadAssetFile() {
        return new Promise((resolve, reject) => {
            this._http.get(ConfigService.JOBS_JSON_PATH)
            .map(res => res.json())
            .subscribe((data) => {
                //this._config = data;
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

    public getJobsJson() {
        return this._jobsJson
    }
    // // Is app in the development mode?
    // isDevmode() {
    //     return this._env === 'development';
    // }
    // // Gets API route based on the provided key
    // getApi(key: string): string {
    //     return this._config["API_ENDPOINTS"][key];
    // }
    // Gets a value of specified property in the configuration file
    // get(key: any) {
    //     return this._config[key];
    // }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.loadAssetFile();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };