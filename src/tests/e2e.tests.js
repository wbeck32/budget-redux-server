const chai = require('chai');
const assert = chai.assert;
const connect = require('../connect');
const connection = require('mongoose').connection;
const req = require('../helpers/request');
const db = require('../helpers/db');
let token = '';

describe('e2e budget tests', () => {
  before(async () => {
    await connect();
    await db.drop();
    token = await db.getToken();
  });

  describe('e2e user tests', () => {
    const testUser = {
      name: 'token joe',
      password: 'abcdef',
      email: 'joe@tokenjoe.com'
    };

    it('signs up a new user', async () => {
      const newUser = await req.post('/api/auth/signup').send(testUser);
      assert.equal(newUser.statusCode, 200);
    });
    it('user login', async () => {
      const signedInUser = await req.post('/api/auth/signin').send(testUser);
      assert.equal(signedInUser.statusCode, 200);
    });
  });

  describe('e2e category tests', async () => {
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
      subCatAmount: 750
    };

    it('POST a new category to a user if it does not already exist', async () => {
      const postNewCat = await req
        .post('/api/me/category')
        .set('Authorization', token)
        .send(testCategory);

      assert.equal(postNewCat.statusCode, 200);
      assert.equal(postNewCat.body.name, 'home');

      const postNewCatAgain = await req
        .post('/api/me/category')
        .set('Authorization', token)
        .send(testCategory);

      assert.deepEqual(postNewCatAgain.body, {});
    }),
      it('GET all categories', async () => {
        const allCategories = await req
          .get('/api/me/category')
          .set('Authorization', token);
        assert.lengthOf(allCategories.body.categories, 1);
      }),
      it('GET category by id', async () => {
        const allCategories = await req
          .get('/api/me/category')
          .set('Authorization', token);
        const cid = allCategories.body.categories[0];
        const getById = await req
          .get(`/api/me/category/${cid}`)
          .set('Authorization', token);
        assert.equal(getById.body._id, cid);
      }),
      it('POST a new subcategory to an existing category', async () => {
        const allCategories = await req
          .get('/api/me/category')
          .set('Authorization', token);
        const cid = allCategories.body.categories[0];
        const updatedCategory = await req
          .patch(`/api/me/category/${cid}`)
          .send(testSubcategory)
          .set('Authorization', token);

        assert.lengthOf(updatedCategory.body.subCategories, 3);
        assert.equal(updatedCategory.body.name, 'home');
      }),
      it('UPDATE existing subcategory with a new budget amount', async () => {
        const allCategories = await req
          .get('/api/me/category')
          .set('Authorization', token);
        const cid = allCategories.body.categories[0];

        const getCategory = await req
          .get(`/api/me/category/${cid}`)
          .set('Authorization', token);
        const { subCategories } = getCategory.body;
        let sid = null;
        for (let key in subCategories) {
          if (subCategories[key].subName === testSubcategory2.subName) {
            sid = subCategories[key]._id;
          }
        }

        const updatedSubcategory = await req
          .patch(`/api/me/category/${cid}/subcategory/${sid}`)
          .set('Authorization', token)
          .send(testSubcategory2);
        assert.equal(updatedSubcategory.body.n, 1);
        assert.equal(updatedSubcategory.body.nModified, 1);
      }),
      it('DELETE existing category and its expenses', async () => {
        const allCategories = await req
          .get('/api/me/category')
          .set('Authorization', token);
        const cid = allCategories.body.categories[0];
        const deleteSubcategory = await req
          .del(`/api/me/category/${cid}`)
          .set('Authorization', token);
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
