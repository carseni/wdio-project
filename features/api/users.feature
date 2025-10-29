Feature: User registration

  Scenario: Register a new user successfully
    Given an existing user
    When I register a new user
    Then the response should contain a valid token

  Scenario: Fail to register with an existing email
    Given an existing user
    When I try to register with the same email
    Then the response should return status 422
