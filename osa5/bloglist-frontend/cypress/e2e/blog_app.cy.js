describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Uuseri',
      username: 'testUser',
      password: 'pass123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('pass123')
      cy.get('#login-button').click()
      cy.contains('Testi Uuseri logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testUser', password: 'pass123' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('e2e cypress testing')
      cy.get('#author-input').type('Tester')
      cy.get('#url-input').type('www.test.com')
      cy.get('#create').click()
      cy.contains('e2e cypress testing Tester')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'Tester',
          url: 'www.test.com'
        })
      })

      it('it can be made liked', function () {
        cy.get('#showDetails').click()
        cy.contains('likes 0')
        cy.get('#like').click()
        cy.contains('likes 1')
      })
    })
  })
})