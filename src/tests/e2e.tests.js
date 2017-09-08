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

  describe.only('e2e user tests', () => {
    const testUser = {
      name: 'token joe',
      password: 'abcdef',
      email: 'joe@tokenjoe.com'
    };

    it('signs up a new user', async () => {
      const newUser = await req.post('/api/auth/signup').send(testUser)
      // console.log('newUser', newUser.body);
    })
  });

  describe('e2e category tests', () => {
    const testCategory = {
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

    const testSubcategory = {
      subName: 'internet',
      subCatAmount: 850
    };

    const testSubcategory2 = {
      subName: 'internet',
      subCatAmount: 850
    };

    it('POST a new category if it does not already exist', async () => {
      const postNewCat = await req.post('/api/me/category').send(testCategory);
      assert.equal(postNewCat.statusCode, 200);
      assert.equal(postNewCat.body.name, testCategory.name);
      const postNewCatAgain = await req
        .post('/api/me/category')
        .send(testCategory);
      assert.deepEqual(postNewCatAgain.body, {});
    }),
      it('GET all categories', async () => {
        const allCategories = await req.get('/api/me/category');
        assert.lengthOf(allCategories.body, 1);
        assert.equal(allCategories.body[0].name, 'home');
      }),
      it('GET category by id', async () => {
        const allCategories = await req.get('/api/me/category');
        const cid = allCategories.body[0]._id;
        const getById = await req.get(`/api/me/category/${cid}`);
        assert.equal(getById.body._id, cid);
      }),
      it('POST a new subcategory to an existing category', async () => {
        const allCategories = await req.get('/api/me/category');
        const cid = allCategories.body[0]._id;
        const savedSubcategory = await req
          .patch(`/api/me/category/${cid}`)
          .send(testSubcategory);
        assert.equal(savedSubcategory.body.n, 1);
        assert.equal(savedSubcategory.body.nModified, 1);
      }),
      it('UPDATE existing subcategory with a new budget amount', async () => {
        const allCategories = await req.get('/api/me/category');
        const cid = allCategories.body[0]._id;
        const sid = allCategories.body[0].subCategories[0]._id;
        const updatedSubcategory = await req
          .patch(`/api/me/category/${cid}/subcategory/${sid}`)
          .send(testSubcategory2);
          assert.equal(updatedSubcategory.body.n, 1);
          assert.equal(updatedSubcategory.body.nModified, 1);
      }),
      it('DELETE existing category and its expenses', async () => {
        const allCategories = await req.get('/api/me/category');
        const cid = allCategories.body[0]._id;
        const deleteSubcategory = await req.del(`/api/me/category/${cid}`)
        assert.equal(deleteSubcategory.body.n, 1);
        assert.equal(deleteSubcategory.body.ok, 1);
      });
  });

  describe('e2e expenses tests', () => {
    it('GET all expenses for a category', async () => {}),
      it('DELETE expense by id', async () => {}),
      it('UPDATE expense amount after transaction', async () => {});
  });
});
