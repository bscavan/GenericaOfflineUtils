import { Job } from "./job";

export interface JsonSerializable {
	serializeToJSON();

	deserializeFromJSON(json);

	getLabel();
}