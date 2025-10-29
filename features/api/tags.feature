Feature: Tags retrieval

  Background:
    Given a registered user with a valid token

  Scenario: Fetch all tags successfully
    When I request all tags
    Then the API should respond with status 200
    And the response should include a list of tags
