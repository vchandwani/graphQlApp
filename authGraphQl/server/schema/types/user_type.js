const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    email: { type: GraphQLString },
  }),
});

module.exports = UserType;
