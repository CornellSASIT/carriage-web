import express from 'express';
import uuid from 'uuid/v1';
import AWS from 'aws-sdk';
import config from '../config';

const router = express.Router();

AWS.config.update(config);
const docClient = new AWS.DynamoDB.DocumentClient();

type Rider = {
  id: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  accessibilityNeeds: {
    needsWheelchair: boolean,
    hasCrutches: boolean,
    needsAssistant: boolean,
  },
  description: string,
  picture: string,
  joinDate: string,
  pronouns: string,
  address: string,
  pastRides: string[],
  requestedRides: string[],
  favoriteLocations: string[],
};

// Get a rider by ID in Riders table
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'Riders',
    Key: { id },
  };
  docClient.get(params, (err, data) => {
    if (err) {
      res.send({ err });
    } else {
      res.send(data);
    }
  });
});

// Get all riders
router.get('/', (req, res) => {
  const params = {
    TableName: 'Riders',
  };
  docClient.scan(params, (err, data) => {
    if (err) {
      res.send({ err });
    } else {
      res.send({ data: data.Items });
    }
  });
});

// TODO: Get all upcoming rides for a rider
router.get('/:id/rides', (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'Riders',
    Key: { id },
  };
  docClient.get(params, (err, data) => {
    if (err) {
      res.send({ err });
    } else if (!data.Item) {
      res.send({
        err: {
          message: 'id not found',
        },
      });
    } else {
      const { requestedRides } = data.Item;
      res.send({ data: requestedRides });
    }
  });
});

// Put a rider in Riders table
router.post('/', (req, res) => {
  const postBody = req.body;
  const user: Rider = {
    id: uuid(),
    firstName: postBody.firstName,
    lastName: postBody.lastName,
    pronouns: postBody.pronouns,
    phoneNumber: postBody.phoneNumber,
    email: postBody.email,
    accessibilityNeeds: postBody.accessibilityNeeds,
    description: postBody.description,
    picture: postBody.picture,
    joinDate: postBody.joinDate,
    address: postBody.address,
    pastRides: [],
    requestedRides: [],
    favoriteLocations: [],
  };
  const params = {
    TableName: 'Riders',
    Item: user,
  };
  docClient.put(params, (err, data) => {
    if (err) {
      res.send({ err });
    } else {
      res.send(user);
    }
  });
});

// TODO: Update an existing rider


// TODO: Delete an existing rider


export default router;
