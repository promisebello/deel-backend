const request = require('supertest');
const app = require('../src/app');
const { Profile, Contract, Job } = require('../src/model');

describe('/admin/best-clients', () => {
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
        id: 2,
        firstName: 'Mr',
        lastName: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type: 'client',
      }),
      Profile.create({
        id: 3,
        firstName: 'John',
        lastName: 'Snow',
        profession: 'Knows nothing',
        balance: 451.3,
        type: 'client',
      }),
      Profile.create({
        id: 5,
        firstName: 'John',
        lastName: 'Lenon',
        profession: 'Musician',
        balance: 150,
        type: 'contractor',
      }),
      Profile.create({
        id: 6,
        firstName: 'Linus',
        lastName: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
        type: 'contractor',
      }),
      Contract.create({
        id: 1,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 1,
        ContractorId: 5,
      }),
      Contract.create({
        id: 2,
        terms: 'for Linux',
        status: 'in_progress',
        ClientId: 2,
        ContractorId: 6,
      }),
      Contract.create({
        id: 3,
        terms: 'for Linux',
        status: 'new',
        ClientId: 2,
        ContractorId: 6,
      }),
      Job.create({
        id: 1,
        description: 'work 1',
        price: 200,
        ContractId: 1,
        paid: true,
        paymentDate: '2020-08-15T19:11:26.737Z',
      }),
      Job.create({
        id: 2,
        description: 'work 2',
        price: 110,
        ContractId: 1,
        paid: true,
        paymentDate: '2020-08-16T19:11:26.737Z',
      }),
      Job.create({
        id: 3,
        description: 'Linux core',
        price: 1000,
        ContractId: 2,
        paid: true,
        paymentDate: '2020-08-15T10:10:00.737Z',
      }),
      Job.create({
        id: 4,
        description: 'LXC module',
        price: 200,
        ContractId: 2,
        paid: true,
        paymentDate: '2008-10-10T19:11:26.737Z',
      }),
      Job.create({
        id: 5,
        description: 'hack windows',
        price: 4000,
        ContractId: 3,
        paid: false,
      }),
    ]);
  });

  it('should not return any result if jobs are not available', async () => {
    const { statusCode, body } = await request(app)
      .get('/admin/best-clients')
      .query({ start: '2020-08-17T00:00:00.000Z' })
      .query({ end: '2020-08-19T23:59:59.000Z' });

    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(0);
  });

  it('should order list by paid money in a descending order', async () => {
    const { statusCode, body } = await request(app)
      .get('/admin/best-clients')
      .query({ start: '2020-08-10T09:00:00.000Z' })
      .query({ end: '2020-08-16T23:59:59.000Z' });

    expect(statusCode).toEqual(200);
    expect(body[0]).toEqual(
      expect.objectContaining({ fullName: 'Mr Robot', id: 2, paid: 1000 }),
    );
    expect(body[1]).toEqual(
      expect.objectContaining({ fullName: 'Harry Potter', id: 1, paid: 310 }),
    );
  });

  it('should limit the list by query parameter', async () => {
    const { statusCode, body } = await request(app)
      .get('/admin/best-clients')
      .query({ start: '2020-08-09T00:00:00.000Z' })
      .query({ end: '2020-08-22T23:59:59.000Z' })
      .query({ limit: 1 });

    expect(statusCode).toEqual(200);
    expect(body[0]).toEqual(
      expect.objectContaining({ fullName: 'Mr Robot', id: 2, paid: 1000 }),
    );
  });
  it('should return the best clients', async () => {
    const { statusCode, body } = await request(app)
      .get('/admin/best-clients')
      .query({ start: '2020-08-09T00:00:00.000Z' })
      .query({ end: '2020-08-22T23:59:59.000Z' });

    expect(statusCode).toEqual(200);
    expect(body).toContainEqual(
      expect.objectContaining({ fullName: 'Mr Robot', id: 2, paid: 1000 }),
    );
    expect(body).toContainEqual(
      expect.objectContaining({ fullName: 'Harry Potter', id: 1, paid: 310 }),
    );
  });
});

describe('The admin entities', () => {
  describe('/admin/best-profession', () => {
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
          balance: 150,
          type: 'contractor',
        }),
        Profile.create({
          id: 6,
          firstName: 'Linus',
          lastName: 'Torvalds',
          profession: 'Programmer',
          balance: 1214,
          type: 'contractor',
        }),
        Contract.create({
          id: 1,
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 5,
        }),
        Contract.create({
          id: 2,
          terms: 'for Linux',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 6,
        }),
        Job.create({
          id: 1,
          description: 'work 1',
          price: 200,
          ContractId: 1,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          createdAt: '2020-08-15T19:11:26.737Z',
        }),
        Job.create({
          id: 2,
          description: 'work 2',
          price: 110,
          ContractId: 1,
          paid: true,
          paymentDate: '2020-08-16T19:11:26.737Z',
          createdAt: '2020-08-16T19:11:26.737Z',
        }),
        Job.create({
          id: 3,
          description: 'Linux core',
          price: 1000,
          ContractId: 2,
          paid: true,
          paymentDate: '2020-08-15T10:10:00.737Z',
          createdAt: '2020-08-15T10:10:00.737Z',
        }),
        Job.create({
          id: 4,
          description: 'LXC module',
          price: 200,
          ContractId: 2,
          paid: true,
          paymentDate: '2008-10-10T19:11:26.737Z',
          createdAt: '2008-10-10T14:51:34.737Z',
        }),
      ]);
    });
    it('should not return anything if jobs are not available', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2021-08-09T08:00:00.000Z' })
        .query({ end: '2021-08-17T13:00:59.000Z' });

      expect(statusCode).toEqual(200);
      expect(body).toBeNull();
    });

    it('should return the best profession in terms of income', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2020-08-10T09:00:00.000Z' })
        .query({ end: '2020-08-16T23:59:59.000Z' });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          profession: 'Programmer',
          totalPaid: 1000,
        }),
      );
    });
  });
});
