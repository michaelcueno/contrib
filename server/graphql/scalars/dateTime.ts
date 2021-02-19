import { GraphQLScalarType } from 'graphql/type/definition';
import { Kind } from 'graphql/language/kinds';
import Maybe from 'graphql/tsutils/Maybe';

import { gql } from 'apollo-server-express';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

[utc, timezone, advancedFormat].forEach(dayjs.extend);

export const DateTimeTypeDefs = gql`
  scalar DateTime
`;

export type SerializedDateTime = string;

// What scalar produces:
// 2021-02-18T21:39:32Z
export const DateTimeResolver = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'Day.js dateTime scalar type',
    parseValue: (value: string) => {
      return dayjs(value);
    },
    parseLiteral(valueNode: any): Maybe<null | { [name: string]: string }> {
      if (valueNode.kind === Kind.STRING && valueNode.value.length) {
        return valueNode.value;
      }
      return null;
    },
    serialize(value: dayjs.Dayjs): Maybe<SerializedDateTime> {
      return value.toISOString();
    },
  }),
};
