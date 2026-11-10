export interface IResourceTags {
  ProjectName?: string;
  Project: string;
  Repository: string;
  Environment: string;
  Owner: string;
  IsCritical: 'true' | 'false';
  IsTemporal: 'true' | 'false';
  [key: string]: string | undefined;
}

export interface ITaggableResource {
  addTags?: (tags: { [key: string]: string }) => void;
  tags?: { [key: string]: string };
}
