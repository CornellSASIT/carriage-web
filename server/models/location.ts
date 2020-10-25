import dynamoose from 'dynamoose';

export type LocationType = {
  id: string;
  name: string;
  address: string;
};

export enum Tag {
  WEST = 'west',
  CENTRAL = 'central',
  NORTH = 'north',
  CTOWN = 'ctown', // college town
  DTOWN = 'dtown', // downtown
}

const schema = new dynamoose.Schema({
  id: String,
  name: String,
  address: String,
  tag: {
    type: String,
    enum: Object.values(Tag),
  },
});

export const Location = dynamoose.model('Locations', schema, { create: false });
