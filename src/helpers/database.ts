import { ForeignKeyViolationError, UniqueViolationError } from 'objection';

export const duplicateEntryForKey = (error: Error, constraintKey: string) => {
  if (error instanceof UniqueViolationError) {
    return constraintKey === error.constraint;
  }

  return false;
};

export const foreignKeyConstraintFails = (error: unknown, column: string) => {
  if (error instanceof ForeignKeyViolationError) {
    const { message } = error;
    return message.includes('FOREIGN KEY')
      && message.includes(`(\`${column}\`)`) // (`column_name`)
      && message.includes('REFERENCES');
  }

  return false;
};
