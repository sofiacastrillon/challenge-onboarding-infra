import { Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IResourceTags, ITaggableResource } from '../interfaces/IResourceTags';

export const getResourceTags = (tags: IResourceTags): IResourceTags => {
  return {
    ProjectName: tags.ProjectName,
    Project: tags.Project,
    Repository: tags.Repository,
    IsCritical: tags.IsCritical,
    IsTemporal: tags.IsTemporal,
    Environment: tags.Environment,
    Owner: tags.Owner,
  };
};

export const applyTags = (scope: Construct, tags: IResourceTags): void => {
  Object.entries(tags).forEach(([key, value]) => {
    if (typeof value !== 'string' || value === '') return;
    Tags.of(scope).add(key, value);
  });
};

export const applyTagsToResource = (
  resource: ITaggableResource,
  tags: IResourceTags,
): void => {
  if (resource.addTags) {
    resource.addTags(tags as { [key: string]: string });
    return;
  }
  throw new Error('Resource does not support addTags method');
};
