import { Ability, ForbiddenError } from '@casl/ability';

export function detectSubjectType(subject: any) {
  if (typeof subject === 'string') {
    return subject;
  }
  if (subject?.modelName) {
    return subject.modelName;
  }
  if (subject?.constructor) {
    return subject.constructor.modelName || subject.constructor.name;
  }
  return subject;
}

export function createAbility(rules: App.Permission.Rule[]): App.Permission.AppAbility {
  return new Ability(rules, { detectSubjectType });
}

export function throwUnlessCanRead(
  ability: App.Permission.AppAbility,
  subject: App.Permission.Subject,
  fields?: string[],
) {
  if (fields?.length) {
    fields.forEach(field => {
      ForbiddenError.from(ability).throwUnlessCan('read', subject, field);
    });
  } else {
    ForbiddenError.from(ability).throwUnlessCan('read', subject);
  }
}

export function throwUnlessCanFind(ability: App.Permission.AppAbility, modelName: string) {
  ForbiddenError.from(ability).throwUnlessCan('find', modelName);
}

export function throwUnlessCanCreate(
  ability: App.Permission.AppAbility,
  subject: App.Permission.Subject,
  fields?: string[],
) {
  if (fields?.length) {
    fields.forEach(field => {
      ForbiddenError.from(ability).throwUnlessCan('create', subject, field);
    });
  } else {
    ForbiddenError.from(ability).throwUnlessCan('create', subject);
  }
}

export function throwUnlessCanUpdate(
  ability: App.Permission.AppAbility,
  subject: App.Permission.Subject,
  fields?: string[],
) {
  if (fields?.length) {
    fields.forEach(field => {
      ForbiddenError.from(ability).throwUnlessCan('update', subject, field);
    });
  } else {
    ForbiddenError.from(ability).throwUnlessCan('update', subject);
  }
}
