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

  describe('e2e category tests', () => {
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
      assert.deepEqual(postNewCatAgain.body, {});
    }),
      it('GET all categories', async () => {
        const allCategories = await req.get('/api/category');
        assert.lengthOf(allCategories.body, 1);
        assert.equal(allCategories.body[0].name, 'home');
      }),
      it('GET category by id', async () => {
        const allCategories = await req.get('/api/category');
        const getById = await req.get('/api/category/:id').query({id: allCategories.body[0]._id});
        assert.equal(getById.body._id, allCategories.body[0]._id)

      }),
      it('POST a new subcategory to an exisiting category', async () => {}),
      it('UPDATE exisiting category with new a new budget amount', async () => {}),
      it('UPDATE exisiting subcategory with new a new budget amount', async () => {}),
      it('DELETE exisiting category and its expenses', async () => {});
  });

  describe('e2e expenses tests', () => {
    it('GET all expenses for a category', async () => {}),
      it('DELETE expense by id', async () => {}),
      it('UPDATE expense amount after transaction', async () => {});
  });
});
