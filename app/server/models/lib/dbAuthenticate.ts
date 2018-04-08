import sequelizeConnection from './connection';

export default function authenticate() {
  return sequelizeConnection.authenticate().then(() => sequelizeConnection);
}
