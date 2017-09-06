const chai = require('chai');
const assert = chai.assert;
const connect = require('../connect');
const connection = require('mongoose').connection;
const req = require('../helpers/request');

describe('e2e budget tests', () => {
  before(async () => {
    await connect();
    await connection.dropDatabase();
  });

  // POST a new category
  // POST a new subcategory
  // GET all categories with expenses
  // GET all expenses for a category
  // UPDATE expense remaining amount after a transaction

  const homeCat = {
    timestamp: Date.now,
    name: 'home',
    catAmount: 1700,
    catRemaining: 1700,
    subCategories: [
      {
        subName: 'rent',
        subCatAmount: 1620,
        subCatRemaining: 1620
      },
      {
        subName: 'electric bill',
        subCatAmount: 174,
        subCatRemaining: 174
      }
    ]
  };

  it('POST a new category if it does not already exist', async () => {
    const postNewCat = await req.post('/api/category').send(homeCat);
    assert.equal(postNewCat.statusCode, 200);
    assert.equal(postNewCat.body.name, 'home');
    const postNewCatAgain = await req.post('/api/category').send(homeCat);
    assert.deepEqual(postNewCatAgain.body, {})
  });
});
