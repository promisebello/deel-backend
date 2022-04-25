const request = require('supertest');
const app = require('../src/app');
const { Profile, Contract, Job } = require('../src/model');

describe('Contract functionalities', () => {
  describe('/contracts', () => {
    beforeEach(async () => {
      await Profile.sync({ force: true });
      await Contract.sync({ force: true });
      await Job.sync({ force: true });

      await Promise.all([
        Profile.create({
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        }),
        Profile.create({
          id: 5,
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        }),
        Contract.create({
          id: 1,
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: 1,
          ContractorId: 5,
        }),
        Contract.create({
          id: 2,
          terms: 'bla bla bla 2',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 5,
        }),
        Contract.create({
          id: 3,
          terms: 'bla bla bla 3',
          status: 'new',
          ClientId: 1,
          ContractorId: 5,
        }),
      ]);
    });

    it('should return contracts that have not been terminated', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(2);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 2,
          terms: 'bla bla bla 2',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 5,
        })
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 3,
          terms: 'bla bla bla 3',
          status: 'new',
          ClientId: 1,
          ContractorId: 5,
        })
      );
    });
  });
  describe('/contracts/:id', () => {
    beforeEach(async () => {
      await Profile.sync({ force: true });
      await Contract.sync({ force: true });
      await Job.sync({ force: true });

      await Promise.all([
        Profile.create({
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        }),
        Profile.create({
          id: 5,
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        }),
        Contract.create({
          id: 1,
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: 1,
          ContractorId: 5,
        }),
      ]);
    });
    it('should return notfound exception if the contract is missing', async () => {
      await request(app)
        .get('/contracts/199')
        .set('profile_id', '5')
        .expect(404);
    });

    
    it('should return the contract when profileid matches with the client id', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts/1')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toMatchObject({
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: 1,
        ContractorId: 5,
      });
    });

    
    it('should return bad request the profile id is invalid', async () => {
      await request(app)
        .get('/contracts/1')
        .set('profile_id', '199')
        .expect(401);
    });

    it('should return the contract when profileid matches with the contractor id', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts/1')
        .set('profile_id', '5');

      expect(statusCode).toEqual(200);
      expect(body).toMatchObject({
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: 1,
        ContractorId: 5,
      });
    });

  });

  
});
