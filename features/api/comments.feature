Feature: Comments management

  Background:
    Given a registered user with a valid token

  Scenario: Add a comment to the article
    When I add a comment to the article
    Then the API should respond with status 200
    And the response should include a comment ID

  Scenario: Fetch comments for the article
    When I add a comment to the article
    When I request all comments for the article
    Then the API should return a list containing the created comment

  Scenario: Delete the comment
    When I add a comment to the article
    When I delete the comment
    Then the API should return status 200

  Scenario: Fetch comments after deletion
    When I request all comments for the article
    Then the API should return an empty list
