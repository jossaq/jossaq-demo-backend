
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
export class PayloadParams {
  TableName?: string;
  Item?: any;
};
const payloadParams = new PayloadParams();
payloadParams.TableName=tableName;


exports.handler = async (event: any, context: any) => {
  console.log('Received event:', JSON.stringify(event.body, null, 2));
  console.log('Received event:', JSON.stringify(context, null, 2));

  let body;
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
  };
  payloadParams.Item=event.body;

  try {
    switch (event.httpMethod) {
      case 'DELETE':
        body = await dynamo.delete(payloadParams).promise();
        break;
      case 'GET':
        body = await dynamo.scan({ TableName: tableName }).promise();
        break;
      case 'POST':
        body = await dynamo.put(payloadParams).promise();
        break;
      case 'PUT':
        body = await dynamo.update(payloadParams).promise();
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = '400';
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};