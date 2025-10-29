Feature: User login

  Background:
    Given an existing user is registered

  Scenario: Login successfully with valid credentials
    When I log in with valid credentials
    Then the API should return a token

  Scenario: Fail to log in with wrong password
    When I log in with an invalid password
    Then the API should return status 403
