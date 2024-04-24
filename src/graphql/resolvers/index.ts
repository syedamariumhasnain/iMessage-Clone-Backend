import userResolvers from "./user";
import merge from 'lodash.merge';

// We are using merge function of lodash so that Query, Mutation and,
// Subscription objects in all the resolvers are merged appropriately
// We can also install specific func. of a library i.e. lodash.merge
const resolvers = merge({}, userResolvers);

export default resolvers;
