import { assert } from 'chai'

import { User } from '@microsoft/microsoft-graph-types'

import { getClient, randomString } from "../test-helper"

declare const describe, it;

describe('Users', function() {
  this.timeout(10*1000);
  it('[Promise] Fetch the authenticated user and access entity properties', function() {
    return getClient().api("https://graph.microsoft.com/v1.0/me/").get().then((res) => {
        const user = res as User;
        assert.isDefined(user.displayName);
        assert.isDefined(user.mail);
        assert.isDefined(user.id);
        
        assert.isDefined(user.surname);
        assert.isDefined(user.userPrincipalName);
        
        assert.isArray(user.businessPhones);

        assert.isUndefined(user['invalidPropertyName']);
      });
  });

  it('[Callback] Fetch the authenticated user and access entity properties', function() {
    return new Promise((resolve, reject) => {
      getClient().api("https://graph.microsoft.com/v1.0/me/").get((err, res) => {
        const user = res as User;
        assert.isDefined(user.displayName);
        assert.isDefined(user.mail);
        assert.isDefined(user.id);
        
        assert.isDefined(user.surname);
        assert.isDefined(user.userPrincipalName);
        
        assert.isArray(user.businessPhones);

        assert.isUndefined(user['invalidPropertyName']);
        resolve();
      });
    });
  });


  it('Modify and verify officeLocation property', function() {
    const officeLocation = randomString();

    return getClient().api("https://graph.microsoft.com/v1.0/me/").patch({officeLocation}).then(() => {
      return getClient().api("https://graph.microsoft.com/v1.0/me/").get().then((res) => {
        const user = res as User;
        assert.equal(user.officeLocation, officeLocation);
        return Promise.resolve();
      });
    });
  });


  it('[Promise] Modify and verify givenName property', function() {
    const givenName = randomString();

    return getClient().api("https://graph.microsoft.com/v1.0/me/").patch({givenName}).then(() => {
      return getClient().api("https://graph.microsoft.com/v1.0/me/").get().then((res) => {
        const user = res as User;
        assert.equal(user.givenName, givenName);
        return Promise.resolve();
      });
    });
  });
  
  it('[Callback] Modify and verify givenName property', function() {
    const givenName = randomString();

    return new Promise((resolve, reject) => {
      getClient().api("https://graph.microsoft.com/v1.0/me/").patch({givenName}, (err, res) => {
        getClient().api("https://graph.microsoft.com/v1.0/me/").get((err, res) => {
          const user = res as User;
          assert.equal(user.givenName, givenName);
          resolve();
        });
      });
    });
  });

  it('Fetch a list of users and access properties on a collection item', function() {
    return getClient().api("https://graph.microsoft.com/v1.0/users/").get().then((collection) => {
      const users:User[] = collection.value;
      assert.isDefined(users[0].displayName);
      assert.isDefined(users[0].id);
      assert.isDefined(users[0].mail);
    });
  });


  it('Filters on users list', function() {
    return getClient()
      .api("https://graph.microsoft.com/v1.0/users")
      .filter("Department eq 'Finance'")
      .get();
  });
});